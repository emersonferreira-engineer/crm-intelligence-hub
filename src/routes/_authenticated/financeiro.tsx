import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/editable-cell";
import { useRows, useUpdateRow } from "@/lib/crm";
import { formatBRL, formatPct } from "@/lib/calc";

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro | CRM Intelligence Hub" },
      {
        name: "description",
        content: "Receita, custos, lucro líquido e margem mês a mês com cálculo automático em tempo real.",
      },
      { property: "og:title", content: "Financeiro | CRM Intelligence Hub" },
      { property: "og:description", content: "Painel financeiro editável com lucro, margem e atingimento de meta." },
    ],
  }),
  component: Financeiro,
});

function Financeiro() {
  const { data: linhas = [], isLoading } = useRows("financeiro_mensal");
  const atualizar = useUpdateRow("financeiro_mensal");

  const dados = useMemo(
    () =>
      [...linhas]
        .sort((a, b) => String(a.mes_ref).localeCompare(String(b.mes_ref)))
        .map((l) => {
          const receita = Number(l.receita) || 0;
          const custos =
            (Number(l.marketing) || 0) + (Number(l.folha) || 0) + (Number(l.despesas_operacionais) || 0);
          const lucro = receita - custos;
          return {
            ...l,
            custos,
            lucro,
            margem: receita > 0 ? (lucro / receita) * 100 : 0,
            atingimento: Number(l.meta) > 0 ? (receita / Number(l.meta)) * 100 : 0,
          };
        }),
    [linhas],
  );

  const totais = dados.reduce(
    (acc, d) => ({
      receita: acc.receita + Number(d.receita || 0),
      custos: acc.custos + d.custos,
      lucro: acc.lucro + d.lucro,
      meta: acc.meta + Number(d.meta || 0),
    }),
    { receita: 0, custos: 0, lucro: 0, meta: 0 },
  );
  const margemTotal = totais.receita > 0 ? (totais.lucro / totais.receita) * 100 : 0;

  const salvar = (id: string, campo: string) => (valor: string | number) =>
    atualizar.mutate({ id, values: { [campo]: valor } });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Financeiro"
        description="Edite receita, meta e custos: lucro, margem e atingimento são recalculados na hora."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Receita acumulada" value={formatBRL(totais.receita)} />
        <KpiCard label="Custos totais" value={formatBRL(totais.custos)} />
        <KpiCard label="Lucro líquido" value={formatBRL(totais.lucro)} />
        <KpiCard label="Margem líquida" value={formatPct(margemTotal)} />
      </div>

      <Card className="overflow-hidden p-0 shadow-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-right">Meta</TableHead>
                <TableHead className="text-right">Marketing</TableHead>
                <TableHead className="text-right">Folha</TableHead>
                <TableHead className="text-right">Despesas op.</TableHead>
                <TableHead className="text-right">Lucro</TableHead>
                <TableHead className="text-right">Margem</TableHead>
                <TableHead className="text-right">Meta atingida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                    Carregando dados financeiros...
                  </TableCell>
                </TableRow>
              )}
              {dados.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-semibold">{String(d.mes_ref)}</TableCell>
                  {(["receita", "meta", "marketing", "folha", "despesas_operacionais"] as const).map((campo) => (
                    <TableCell key={campo} className="text-right">
                      <EditableCell
                        type="number"
                        align="right"
                        value={Number(d[campo] ?? 0)}
                        format={formatBRL}
                        onSave={salvar(d.id, campo)}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold tabular-nums">{formatBRL(d.lucro)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPct(d.margem)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPct(d.atingimento)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
