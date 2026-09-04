import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader, SectionCardTitle } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { campanhas, canaisConversao, formatBRL, formatNum } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/marketing/trafego")({
  head: () => ({
    meta: [
      { title: "Tráfego Pago | CRM Intelligence Hub" },
      { name: "description", content: "Análise de mídia paga: impressões, CTR, CPC, leads, receita e ROAS por campanha." },
      { property: "og:title", content: "Tráfego Pago | CRM Intelligence Hub" },
      { property: "og:description", content: "Comparativo entre Google Ads, Meta Ads, orgânico e e-mail marketing." },
    ],
  }),
  component: TrafegoPago,
});

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--card-foreground)",
};

const cores = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function TrafegoPago() {
  const rows = campanhas.map((c) => ({
    ...c,
    ctr: (c.cliques / c.impressoes) * 100,
    cpc: c.investimento / c.cliques,
    roas: c.receita / c.investimento,
    roi: ((c.receita - c.investimento) / c.investimento) * 100,
  }));

  return (
    <div className="space-y-5">
      <PageHeader title="Tráfego Pago" description="Performance detalhada de mídia por campanha e canal" />

      <Card className="border-border/70 shadow-card">
        <CardHeader>
          <SectionCardTitle title="Detalhamento por campanha" subtitle="Últimos 30 dias" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Campanha</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Investimento</TableHead>
                  <TableHead>Impressões</TableHead>
                  <TableHead>Cliques</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>CPC</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Conversões</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead>ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/40">
                    <TableCell className="font-semibold">{c.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{c.canal}</TableCell>
                    <TableCell className="tabular-nums">{formatBRL(c.investimento)}</TableCell>
                    <TableCell className="tabular-nums">{formatNum(c.impressoes)}</TableCell>
                    <TableCell className="tabular-nums">{formatNum(c.cliques)}</TableCell>
                    <TableCell className="tabular-nums">{c.ctr.toFixed(2)}%</TableCell>
                    <TableCell className="tabular-nums">{formatBRL(c.cpc)}</TableCell>
                    <TableCell className="tabular-nums">{formatNum(c.leads)}</TableCell>
                    <TableCell className="tabular-nums">{c.conversoes}</TableCell>
                    <TableCell className="tabular-nums">{formatBRL(c.receita)}</TableCell>
                    <TableCell>
                      <span className="rounded-md bg-success/12 px-2 py-0.5 text-xs font-bold tabular-nums text-success">
                        {c.roas.toFixed(1)}x
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Investimento por canal" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={canaisConversao} dataKey="investimento" nameKey="canal" outerRadius={95}>
                  {canaisConversao.map((_, i) => (
                    <Cell key={i} fill={cores[i % cores.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatBRL(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Leads por campanha" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} layout="vertical" margin={{ left: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="nome" stroke="var(--muted-foreground)" fontSize={10} width={120} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="leads" name="Leads" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Conversão por canal" subtitle="Percentual de leads convertidos em clientes" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={canaisConversao}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="canal" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} unit="%" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="conversao" name="Conversão" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="ROI por campanha" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="id" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} unit="%" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${Math.round(v)}%`} />
                <Bar dataKey="roi" name="ROI" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
