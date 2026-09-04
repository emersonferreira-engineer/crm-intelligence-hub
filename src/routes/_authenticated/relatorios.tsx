import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, SectionCardTitle } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { campanhas, clientes, formatBRL, leads, oportunidades } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | CRM Intelligence Hub" },
      { name: "description", content: "Relatórios exportáveis de pipeline, vendas, campanhas, tráfego, ROI, retenção e LTV." },
      { property: "og:title", content: "Relatórios | CRM Intelligence Hub" },
      { property: "og:description", content: "Exportação em CSV dos dados comerciais, de marketing e de clientes." },
    ],
  }),
  component: RelatoriosPage,
});

type Row = Record<string, string | number>;

function toCsv(rows: Row[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]!);
  const body = rows.map((r) => headers.map((h) => `"${String(r[h] ?? "")}"`).join(";"));
  return [headers.join(";"), ...body].join("\n");
}

function download(nome: string, rows: Row[]) {
  const blob = new Blob([`\uFEFF${toCsv(rows)}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nome}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Relatório exportado", { description: `${nome}.csv · ${rows.length} registros` });
}

const grupos = [
  {
    grupo: "Comercial",
    itens: [
      {
        nome: "pipeline",
        titulo: "Pipeline",
        descricao: "Oportunidades abertas por etapa, valor e probabilidade.",
        registros: oportunidades.length,
        get: (): Row[] =>
          oportunidades.map((o) => ({
            id: o.id,
            cliente: o.cliente,
            etapa: o.etapa,
            valor: o.valor,
            probabilidade: o.probabilidade,
            responsavel: o.responsavel,
            fechamento: o.fechamentoPrevisto,
          })),
      },
      {
        nome: "vendas",
        titulo: "Vendas",
        descricao: "Negócios fechados com valor e responsável.",
        registros: oportunidades.filter((o) => o.etapa === "Fechado").length,
        get: (): Row[] =>
          oportunidades
            .filter((o) => o.etapa === "Fechado")
            .map((o) => ({ id: o.id, cliente: o.cliente, valor: o.valor, responsavel: o.responsavel })),
      },
      {
        nome: "conversao",
        titulo: "Conversão",
        descricao: "Leads por status, origem e score.",
        registros: leads.length,
        get: (): Row[] =>
          leads.map((l) => ({
            id: l.id,
            nome: l.nome,
            empresa: l.empresa,
            status: l.status,
            origem: l.origem,
            score: l.score,
            responsavel: l.responsavel,
          })),
      },
    ],
  },
  {
    grupo: "Marketing",
    itens: [
      {
        nome: "campanhas",
        titulo: "Campanhas",
        descricao: "Investimento, leads, conversões e receita por campanha.",
        registros: campanhas.length,
        get: (): Row[] =>
          campanhas.map((c) => ({
            id: c.id,
            campanha: c.nome,
            canal: c.canal,
            investimento: c.investimento,
            leads: c.leads,
            conversoes: c.conversoes,
            receita: c.receita,
          })),
      },
      {
        nome: "trafego",
        titulo: "Tráfego",
        descricao: "Impressões, cliques, CTR e CPC por campanha.",
        registros: campanhas.length,
        get: (): Row[] =>
          campanhas.map((c) => ({
            campanha: c.nome,
            canal: c.canal,
            impressoes: c.impressoes,
            cliques: c.cliques,
            ctr: ((c.cliques / c.impressoes) * 100).toFixed(2),
            cpc: (c.investimento / c.cliques).toFixed(2),
          })),
      },
      {
        nome: "roi",
        titulo: "ROI",
        descricao: "Retorno sobre investimento por campanha.",
        registros: campanhas.length,
        get: (): Row[] =>
          campanhas.map((c) => ({
            campanha: c.nome,
            investimento: c.investimento,
            receita: c.receita,
            roas: (c.receita / c.investimento).toFixed(2),
            roi: (((c.receita - c.investimento) / c.investimento) * 100).toFixed(1),
          })),
      },
    ],
  },
  {
    grupo: "Clientes",
    itens: [
      {
        nome: "retencao",
        titulo: "Retenção",
        descricao: "Risco de churn, último contato e tickets por conta.",
        registros: clientes.length,
        get: (): Row[] =>
          clientes.map((c) => ({
            empresa: c.empresa,
            segmento: c.segmento,
            ultimoContato: c.ultimoContato,
            riscoChurn: c.riscoChurn,
            tickets: c.tickets,
          })),
      },
      {
        nome: "ltv",
        titulo: "LTV",
        descricao: "Lifetime value, compras e frequência por cliente.",
        registros: clientes.length,
        get: (): Row[] =>
          clientes.map((c) => ({
            empresa: c.empresa,
            ltv: c.ltv,
            compras: c.compras,
            frequenciaMeses: c.frequenciaCompraMeses,
          })),
      },
    ],
  },
];

function RelatoriosPage() {
  const ltvTotal = clientes.reduce((s, c) => s + c.ltv, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Relatórios"
        description={`Exportações prontas · base atual com ${leads.length} leads e ${formatBRL(ltvTotal)} em LTV`}
      />

      {grupos.map((g) => (
        <Card key={g.grupo} className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title={g.grupo} subtitle="Exportação em CSV compatível com Excel e Power BI" />
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {g.itens.map((r) => (
              <div key={r.nome} className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  <p className="text-sm font-bold">{r.titulo}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.descricao}</p>
                <p className="mt-2 text-[0.7rem] text-muted-foreground">{r.registros} registros</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => download(`relatorio-${r.nome}`, r.get())}
                >
                  <Download className="h-3.5 w-3.5" /> Exportar CSV
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
