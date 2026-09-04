import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, History, Plus, Search, Trash2 } from "lucide-react";

import { EditableCell, EditableSelect } from "@/components/editable-cell";
import { PageHeader } from "@/components/page-header";
import { RegistroTimeline } from "@/components/registro-timeline";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dataCurta } from "@/lib/calc";
import {
  leadStatuses,
  origens,
  responsaveis,
  useDeleteRow,
  useInsertRow,
  useRows,
  useUpdateRow,
  type Lead,
} from "@/lib/crm";
import { usePermissao } from "@/lib/permissoes";

export const Route = createFileRoute("/_authenticated/comercial/leads")({
  head: () => ({
    meta: [
      { title: "Leads | CRM Intelligence Hub" },
      { name: "description", content: "Base de leads com busca, filtros, ordenação, score e cadastro." },
      { property: "og:title", content: "Leads | CRM Intelligence Hub" },
      { property: "og:description", content: "Gestão completa da base de leads comerciais." },
    ],
  }),
  component: LeadsPage,
});

type SortKey = "nome" | "empresa" | "score" | "created_at";

function LeadsPage() {
  const { data: rows = [], isLoading } = useRows("leads");
  const atualizar = useUpdateRow("leads");
  const criar = useInsertRow("leads");
  const remover = useDeleteRow("leads");
  const { pode } = usePermissao();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("todos");
  const [origem, setOrigem] = useState("todas");
  const [resp, setResp] = useState("todos");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "created_at", dir: "desc" });
  const [open, setOpen] = useState(false);
  const [detalhe, setDetalhe] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = rows.filter((l) => {
      const matches =
        !term ||
        [l.nome, l.empresa, l.email, l.campanha, l.cargo].some((f) => (f ?? "").toLowerCase().includes(term));
      return (
        matches &&
        (status === "todos" || l.status === status) &&
        (origem === "todas" || l.origem === origem) &&
        (resp === "todos" || l.responsavel === resp)
      );
    });
    return [...out].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.key === "score") return (a.score - b.score) * dir;
      return String(a[sort.key] ?? "").localeCompare(String(b[sort.key] ?? "")) * dir;
    });
  }, [rows, q, status, origem, resp, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  const salvar = (id: string, campo: string, valor: string | number) =>
    atualizar.mutate({ id, values: { [campo]: valor } as never });

  const onCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    criar.mutate(
      {
        nome: String(fd.get("nome") ?? ""),
        empresa: String(fd.get("empresa") ?? ""),
        cargo: String(fd.get("cargo") ?? ""),
        email: String(fd.get("email") ?? ""),
        telefone: String(fd.get("telefone") ?? ""),
        origem: String(fd.get("origem") ?? origens[0]),
        campanha: String(fd.get("campanha") ?? ""),
        score: Number(fd.get("score") ?? 60),
        responsavel: String(fd.get("responsavel") ?? responsaveis[0]),
        status: String(fd.get("status") ?? "Novo"),
      },
      { onSuccess: () => setOpen(false) },
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        description={`${filtered.length} de ${rows.length} leads na base · edite qualquer campo direto na tabela`}
        actions={
          pode("criar") ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" /> Novo lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Cadastrar lead</DialogTitle>
                  <DialogDescription>Preencha os dados para incluir o lead no pipeline.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
                  {[
                    { name: "nome", label: "Nome", required: true },
                    { name: "empresa", label: "Empresa", required: true },
                    { name: "cargo", label: "Cargo" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "telefone", label: "Telefone" },
                    { name: "campanha", label: "Campanha" },
                  ].map((f) => (
                    <div key={f.name} className="grid gap-1.5">
                      <Label htmlFor={f.name}>{f.label}</Label>
                      <Input id={f.name} name={f.name} type={f.type ?? "text"} required={f.required} />
                    </div>
                  ))}
                  <div className="grid gap-1.5">
                    <Label htmlFor="score">Score (0-100)</Label>
                    <Input id="score" name="score" type="number" min={0} max={100} defaultValue={60} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Origem</Label>
                    <Select name="origem" defaultValue="Google Ads">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {origens.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Responsável</Label>
                    <Select name="responsavel" defaultValue="Ana Ribeiro">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {responsaveis.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Status</Label>
                    <Select name="status" defaultValue="Novo">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {leadStatuses.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter className="sm:col-span-2">
                    <Button type="submit" disabled={criar.isPending}>Salvar lead</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      <Card className="border-border/70 shadow-card">
        <CardContent className="space-y-4 pt-0">
          <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,180px))]">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nome, empresa, email ou campanha"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                {leadStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={origem} onValueChange={setOrigem}>
              <SelectTrigger><SelectValue placeholder="Origem" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as origens</SelectItem>
                {origens.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={resp} onValueChange={setResp}>
              <SelectTrigger><SelectValue placeholder="Responsável" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os responsáveis</SelectItem>
                {responsaveis.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/60">
                    {([
                      ["nome", "Nome"],
                      ["empresa", "Empresa"],
                    ] as [SortKey, string][]).map(([key, label]) => (
                      <TableHead key={key}>
                        <button onClick={() => toggleSort(key)} className="inline-flex items-center gap-1 font-semibold">
                          {label} <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                    ))}
                    <TableHead>Cargo</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Origem / Campanha</TableHead>
                    <TableHead>
                      <button onClick={() => toggleSort("score")} className="inline-flex items-center gap-1 font-semibold">
                        Score <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow key={l.id} className="hover:bg-muted/40">
                      <TableCell className="font-semibold">
                        <EditableCell value={l.nome} onSave={(v) => salvar(l.id, "nome", v)} />
                      </TableCell>
                      <TableCell>
                        <EditableCell value={l.empresa} onSave={(v) => salvar(l.id, "empresa", v)} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <EditableCell value={l.cargo} onSave={(v) => salvar(l.id, "cargo", v)} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <EditableCell value={l.email} onSave={(v) => salvar(l.id, "email", v)} className="text-xs" />
                        <EditableCell value={l.telefone} onSave={(v) => salvar(l.id, "telefone", v)} className="text-xs" />
                      </TableCell>
                      <TableCell>
                        <EditableSelect value={l.origem} options={origens} onSave={(v) => salvar(l.id, "origem", v)} />
                        <EditableCell
                          value={l.campanha}
                          onSave={(v) => salvar(l.id, "campanha", v)}
                          className="text-xs text-muted-foreground"
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          type="number"
                          align="right"
                          value={l.score}
                          onSave={(v) => salvar(l.id, "score", v)}
                          className="font-bold text-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <EditableSelect
                          value={l.responsavel}
                          options={responsaveis}
                          onSave={(v) => salvar(l.id, "responsavel", v)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableSelect
                          value={l.status}
                          options={leadStatuses}
                          onSave={(v) => salvar(l.id, "status", v)}
                        />
                        <div className="mt-1">
                          <StatusBadge status={l.status} />
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">{dataCurta(l.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" title="Histórico" onClick={() => setDetalhe(l)}>
                            <History className="h-4 w-4" />
                          </Button>
                          {pode("excluir") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Remover"
                              onClick={() => remover.mutate(l.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhum lead encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={Boolean(detalhe)} onOpenChange={(o) => !o && setDetalhe(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="truncate">{detalhe?.nome}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            {detalhe && <RegistroTimeline entidade="leads" registroId={detalhe.id} titulo="Histórico do lead" />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
