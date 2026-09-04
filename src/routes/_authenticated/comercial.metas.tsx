import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";

import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
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
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/editable-cell";
import { formatBRL, formatNum, formatPct } from "@/lib/calc";
import { atingimento, mesLongo, mesRef, useMetas, useRemoverMeta, useSalvarMeta } from "@/lib/comercial";
import { responsaveis, useRows } from "@/lib/crm";
import { usePermissao } from "@/lib/permissoes";

export const Route = createFileRoute("/_authenticated/comercial/metas")({
  head: () => ({
    meta: [
      { title: "Metas por vendedor | CRM Intelligence Hub" },
      {
        name: "description",
        content:
          "Metas individuais de receita, negócios e leads por mês, com atingimento calculado a partir das vendas reais.",
      },
      { property: "og:title", content: "Metas por vendedor" },
      {
        property: "og:description",
        content: "Acompanhe o atingimento de metas individuais em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MetasPage,
});

function MetasPage() {
  const { data: metas = [], isLoading } = useMetas();
  const { data: vendas = [] } = useRows("vendas");
  const { data: leads = [] } = useRows("leads");
  const salvar = useSalvarMeta();
  const remover = useRemoverMeta();
  const { pode } = usePermissao();

  const [mes, setMes] = useState(mesRef());
  const [open, setOpen] = useState(false);

  const meses = useMemo(() => {
    const set = new Set<string>([mesRef()]);
    for (const m of metas) set.add(String(m.mes_ref).slice(0, 10));
    return [...set].sort().reverse();
  }, [metas]);

  const doMes = useMemo(
    () => metas.filter((m) => String(m.mes_ref).slice(0, 10) === mes),
    [metas, mes],
  );

  const realizadoPor = useMemo(() => {
    const prefixo = mes.slice(0, 7);
    const mapa = new Map<string, { receita: number; negocios: number; leads: number }>();
    const get = (nome: string) =>
      mapa.get(nome) ?? mapa.set(nome, { receita: 0, negocios: 0, leads: 0 }).get(nome)!;

    for (const v of vendas) {
      if (String(v.data_venda).slice(0, 7) !== prefixo) continue;
      const r = get(v.vendedor);
      r.receita += Number(v.valor);
      r.negocios += 1;
    }
    for (const l of leads) {
      if (String(l.created_at).slice(0, 7) !== prefixo) continue;
      get(l.responsavel).leads += 1;
    }
    return mapa;
  }, [vendas, leads, mes]);

  const totais = useMemo(() => {
    const metaReceita = doMes.reduce((s, m) => s + Number(m.meta_receita), 0);
    const metaNegocios = doMes.reduce((s, m) => s + m.meta_negocios, 0);
    const metaLeads = doMes.reduce((s, m) => s + m.meta_leads, 0);
    let receita = 0;
    let negocios = 0;
    let leadsReais = 0;
    for (const m of doMes) {
      const r = realizadoPor.get(m.responsavel);
      receita += r?.receita ?? 0;
      negocios += r?.negocios ?? 0;
      leadsReais += r?.leads ?? 0;
    }
    return { metaReceita, metaNegocios, metaLeads, receita, negocios, leadsReais };
  }, [doMes, realizadoPor]);

  const criar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    salvar.mutate(
      {
        responsavel: String(fd.get("responsavel") ?? responsaveis[0]),
        mes_ref: String(fd.get("mes_ref") ?? mes),
        meta_receita: Number(fd.get("meta_receita") ?? 0),
        meta_negocios: Number(fd.get("meta_negocios") ?? 0),
        meta_leads: Number(fd.get("meta_leads") ?? 0),
      },
      { onSuccess: () => setOpen(false) },
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Metas por vendedor"
        description="Metas individuais por mês. O atingimento é calculado com as vendas e os leads reais — edite os valores direto na tabela."
        actions={
          pode("criar") ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" /> Nova meta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Definir meta</DialogTitle>
                  <DialogDescription>Uma meta por responsável e mês.</DialogDescription>
                </DialogHeader>
                <form onSubmit={criar} className="space-y-3">
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
                  <div className="grid gap-1.5">
                    <Label htmlFor="mes_ref">Mês de referência</Label>
                    <Input id="mes_ref" name="mes_ref" type="date" defaultValue={mes} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="meta_receita">Receita</Label>
                      <Input id="meta_receita" name="meta_receita" type="number" min={0} defaultValue={100000} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="meta_negocios">Negócios</Label>
                      <Input id="meta_negocios" name="meta_negocios" type="number" min={0} defaultValue={6} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="meta_leads">Leads</Label>
                      <Input id="meta_leads" name="meta_leads" type="number" min={0} defaultValue={80} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={salvar.isPending}>
                      Salvar meta
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={mes} onValueChange={setMes}>
          <SelectTrigger className="w-[16rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {meses.map((m) => (
              <SelectItem key={m} value={m}>
                {mesLongo(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Meta de receita do time"
          value={formatBRL(totais.metaReceita)}
          hint={`Realizado ${formatBRL(totais.receita)}`}
          icon={<Target className="h-4 w-4" />}
        />
        <KpiCard
          label="Atingimento de receita"
          value={formatPct(totais.metaReceita > 0 ? (totais.receita / totais.metaReceita) * 100 : 0)}
          hint="Vendas do mês selecionado"
          icon={<Target className="h-4 w-4" />}
        />
        <KpiCard
          label="Negócios fechados"
          value={`${formatNum(totais.negocios)} / ${formatNum(totais.metaNegocios)}`}
          hint="Quantidade de vendas"
          icon={<Target className="h-4 w-4" />}
        />
        <KpiCard
          label="Leads gerados"
          value={`${formatNum(totais.leadsReais)} / ${formatNum(totais.metaLeads)}`}
          hint="Leads criados no mês"
          icon={<Target className="h-4 w-4" />}
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <Card className="border-border/70 shadow-card">
          <CardContent className="pt-0">
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/60">
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Meta receita</TableHead>
                    <TableHead className="text-right">Realizado</TableHead>
                    <TableHead>Atingimento</TableHead>
                    <TableHead className="text-right">Negócios</TableHead>
                    <TableHead className="text-right">Leads</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doMes.map((m) => {
                    const real = realizadoPor.get(m.responsavel) ?? { receita: 0, negocios: 0, leads: 0 };
                    const at = atingimento(m, real);
                    return (
                      <TableRow key={m.id} className="hover:bg-muted/40">
                        <TableCell className="font-semibold">{m.responsavel}</TableCell>
                        <TableCell className="text-right">
                          <EditableCell
                            type="number"
                            align="right"
                            value={Number(m.meta_receita)}
                            onSave={(v) =>
                              salvar.mutate({
                                id: m.id,
                                responsavel: m.responsavel,
                                mes_ref: String(m.mes_ref).slice(0, 10),
                                meta_receita: Number(v),
                                meta_negocios: m.meta_negocios,
                                meta_leads: m.meta_leads,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{formatBRL(real.receita)}</TableCell>
                        <TableCell className="min-w-[10rem]">
                          <div className="space-y-1">
                            <Progress value={Math.min(at.receita, 100)} />
                            <p className="text-xs text-muted-foreground">{formatPct(at.receita)} da meta</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <EditableCell
                            type="number"
                            align="right"
                            value={m.meta_negocios}
                            onSave={(v) =>
                              salvar.mutate({
                                id: m.id,
                                responsavel: m.responsavel,
                                mes_ref: String(m.mes_ref).slice(0, 10),
                                meta_receita: Number(m.meta_receita),
                                meta_negocios: Number(v),
                                meta_leads: m.meta_leads,
                              })
                            }
                          />
                          <p className="text-xs text-muted-foreground">real {formatNum(real.negocios)}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <EditableCell
                            type="number"
                            align="right"
                            value={m.meta_leads}
                            onSave={(v) =>
                              salvar.mutate({
                                id: m.id,
                                responsavel: m.responsavel,
                                mes_ref: String(m.mes_ref).slice(0, 10),
                                meta_receita: Number(m.meta_receita),
                                meta_negocios: m.meta_negocios,
                                meta_leads: Number(v),
                              })
                            }
                          />
                          <p className="text-xs text-muted-foreground">real {formatNum(real.leads)}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          {pode("excluir") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Remover meta"
                              onClick={() => remover.mutate(m.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {doMes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhuma meta definida para {mesLongo(mes)}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
