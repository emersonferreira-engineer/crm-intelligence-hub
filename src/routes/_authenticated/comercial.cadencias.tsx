import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, Plus, Trash2, Zap } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  canaisCadencia,
  useCadencias,
  useEtapasCadencia,
  useRemoverCadencia,
  useRemoverEtapa,
  useSalvarCadencia,
  useSalvarEtapa,
} from "@/lib/comercial";
import { responsaveis, useRows } from "@/lib/crm";
import { useAplicarCadencia } from "@/lib/comercial";
import { usePermissao } from "@/lib/permissoes";

export const Route = createFileRoute("/_authenticated/comercial/cadencias")({
  head: () => ({
    meta: [
      { title: "Cadências de follow-up | CRM Intelligence Hub" },
      {
        name: "description",
        content:
          "Monte sequências de follow-up por e-mail, ligação e WhatsApp e aplique em leads para gerar tarefas automáticas.",
      },
      { property: "og:title", content: "Cadências de follow-up" },
      {
        property: "og:description",
        content: "Automação de follow-up comercial com etapas, canais e prazos configuráveis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CadenciasPage,
});

function CadenciasPage() {
  const { data: cadencias = [], isLoading } = useCadencias();
  const { data: etapas = [] } = useEtapasCadencia();
  const { data: leads = [] } = useRows("leads");
  const salvarCadencia = useSalvarCadencia();
  const salvarEtapa = useSalvarEtapa();
  const removerEtapa = useRemoverEtapa();
  const removerCadencia = useRemoverCadencia();
  const aplicar = useAplicarCadencia();
  const { pode } = usePermissao();

  const [novaOpen, setNovaOpen] = useState(false);
  const [etapaDe, setEtapaDe] = useState<string | null>(null);
  const [aplicarDe, setAplicarDe] = useState<string | null>(null);

  const porCadencia = useMemo(() => {
    const mapa = new Map<string, typeof etapas>();
    for (const e of etapas) mapa.set(e.cadencia_id, [...(mapa.get(e.cadencia_id) ?? []), e]);
    return mapa;
  }, [etapas]);

  const criarCadencia = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    salvarCadencia.mutate(
      {
        nome: String(fd.get("nome") ?? ""),
        descricao: String(fd.get("descricao") ?? ""),
        canal_padrao: String(fd.get("canal_padrao") ?? "Email"),
      },
      { onSuccess: () => setNovaOpen(false) },
    );
  };

  const criarEtapa = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!etapaDe) return;
    const fd = new FormData(e.currentTarget);
    const atuais = porCadencia.get(etapaDe) ?? [];
    salvarEtapa.mutate(
      {
        cadencia_id: etapaDe,
        ordem: atuais.length + 1,
        dias_apos: Number(fd.get("dias_apos") ?? 0),
        canal: String(fd.get("canal") ?? "Email"),
        assunto: String(fd.get("assunto") ?? ""),
        roteiro: String(fd.get("roteiro") ?? ""),
      },
      { onSuccess: () => setEtapaDe(null) },
    );
  };

  const aplicarEmLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!aplicarDe) return;
    const fd = new FormData(e.currentTarget);
    aplicar.mutate(
      {
        cadenciaId: aplicarDe,
        relacionado: String(fd.get("relacionado") ?? ""),
        responsavel: String(fd.get("responsavel") ?? responsaveis[0]),
      },
      { onSuccess: () => setAplicarDe(null) },
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Cadências de follow-up"
        description="Sequências de contato padronizadas. Ao aplicar em um lead, o sistema agenda as tarefas com as datas certas em Atividades."
        actions={
          pode("criar") ? (
            <Dialog open={novaOpen} onOpenChange={setNovaOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" /> Nova cadência
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Nova cadência</DialogTitle>
                  <DialogDescription>Depois adicione as etapas com canal e prazo.</DialogDescription>
                </DialogHeader>
                <form onSubmit={criarCadencia} className="space-y-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" name="nome" required placeholder="Ex.: Prospecção outbound 14 dias" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea id="descricao" name="descricao" rows={3} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Canal padrão</Label>
                    <Select name="canal_padrao" defaultValue="Email">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {canaisCadencia.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={salvarCadencia.isPending}>
                      Criar cadência
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      {isLoading && <Skeleton className="h-48 w-full" />}

      {!isLoading && cadencias.length === 0 && (
        <Card className="p-6 text-sm text-muted-foreground">
          Nenhuma cadência cadastrada ainda. Crie a primeira sequência de follow-up.
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {cadencias.map((c) => {
          const lista = (porCadencia.get(c.id) ?? []).slice().sort((a, b) => a.ordem - b.ordem);
          const duracao = lista.length > 0 ? Math.max(...lista.map((e) => e.dias_apos)) : 0;
          return (
            <Card key={c.id} className="border-border/70 shadow-card">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="truncate text-base">{c.nome}</CardTitle>
                  <p className="text-xs text-muted-foreground">{c.descricao ?? "Sem descrição"}</p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <Badge variant="secondary">{lista.length} etapa(s)</Badge>
                    <Badge variant="outline" className="gap-1">
                      <CalendarClock className="h-3 w-3" /> {duracao} dia(s)
                    </Badge>
                    <Badge variant={c.ativo ? "default" : "outline"}>{c.ativo ? "Ativa" : "Pausada"}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={c.ativo}
                    disabled={!pode("editar")}
                    onCheckedChange={(v) => salvarCadencia.mutate({ id: c.id, nome: c.nome, descricao: c.descricao, canal_padrao: c.canal_padrao, ativo: v })}
                  />
                  {pode("excluir") && (
                    <Button variant="ghost" size="icon" title="Remover" onClick={() => removerCadencia.mutate(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2">
                  {lista.map((e) => (
                    <li key={e.id} className="flex items-start gap-3 rounded-md border border-border/70 p-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                        {e.ordem}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{e.assunto}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.canal} · D+{e.dias_apos}
                          {e.roteiro ? ` · ${e.roteiro}` : ""}
                        </p>
                      </div>
                      {pode("excluir") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Remover etapa"
                          onClick={() => removerEtapa.mutate(e.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      )}
                    </li>
                  ))}
                  {lista.length === 0 && (
                    <li className="text-xs text-muted-foreground">Nenhuma etapa configurada.</li>
                  )}
                </ol>

                <div className="flex flex-wrap gap-2">
                  {pode("criar") && (
                    <Button variant="outline" size="sm" onClick={() => setEtapaDe(c.id)}>
                      <Plus className="h-3.5 w-3.5" /> Adicionar etapa
                    </Button>
                  )}
                  {pode("criar") && (
                    <Button size="sm" onClick={() => setAplicarDe(c.id)} disabled={lista.length === 0}>
                      <Zap className="h-3.5 w-3.5" /> Aplicar em um lead
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={Boolean(etapaDe)} onOpenChange={(o) => !o && setEtapaDe(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova etapa</DialogTitle>
            <DialogDescription>Defina o canal, o prazo em dias e o roteiro do contato.</DialogDescription>
          </DialogHeader>
          <form onSubmit={criarEtapa} className="space-y-3">
            <div className="grid gap-1.5">
              <Label htmlFor="assunto">Assunto</Label>
              <Input id="assunto" name="assunto" required placeholder="Ex.: Ligação de conexão" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="dias_apos">Dias após o início</Label>
                <Input id="dias_apos" name="dias_apos" type="number" min={0} defaultValue={1} />
              </div>
              <div className="grid gap-1.5">
                <Label>Canal</Label>
                <Select name="canal" defaultValue="Email">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {canaisCadencia.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="roteiro">Roteiro / mensagem</Label>
              <Textarea id="roteiro" name="roteiro" rows={3} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={salvarEtapa.isPending}>
                Salvar etapa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(aplicarDe)} onOpenChange={(o) => !o && setAplicarDe(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aplicar cadência</DialogTitle>
            <DialogDescription>
              As tarefas de follow-up serão criadas em Atividades com vencimento a partir de hoje.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={aplicarEmLead} className="space-y-3">
            <div className="grid gap-1.5">
              <Label>Lead</Label>
              <Select name="relacionado" defaultValue={leads[0] ? `${leads[0].nome} · ${leads[0].empresa ?? ""}` : ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((l) => (
                    <SelectItem key={l.id} value={`${l.nome} · ${l.empresa ?? ""}`}>
                      {l.nome} — {l.empresa ?? "sem empresa"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Responsável</Label>
              <Select name="responsavel" defaultValue={responsaveis[0]}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {responsaveis.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={aplicar.isPending}>
                Agendar follow-ups
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
