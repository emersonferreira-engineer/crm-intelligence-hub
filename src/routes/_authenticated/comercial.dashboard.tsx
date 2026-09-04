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
import { Clock, Gauge, Target, TrendingUp } from "lucide-react";

import { KpiCard } from "@/components/kpi-card";
import { PageHeader, SectionCardTitle } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatBRL,
  funil,
  kpisGerais as k,
  motivosPerda,
  receitaPorVendedor,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/comercial/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Comercial | CRM Intelligence Hub" },
      { name: "description", content: "Painel de BI comercial: receita por vendedor, conversão por etapa e ciclo de vendas." },
      { property: "og:title", content: "Dashboard Comercial | CRM Intelligence Hub" },
      { property: "og:description", content: "Performance individual, meta x realizado e motivos de perda." },
    ],
  }),
  component: DashboardComercial,
});

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--card-foreground)",
};

const cores = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function DashboardComercial() {
  const receitaTotal = receitaPorVendedor.reduce((s, v) => s + v.receita, 0);
  const metaTotal = receitaPorVendedor.reduce((s, v) => s + v.meta, 0);
  const cicloMedio = Math.round(
    receitaPorVendedor.reduce((s, v) => s + v.cicloDias, 0) / receitaPorVendedor.length,
  );

  const conversaoEtapas = funil.slice(1).map((f, i) => ({
    etapa: f.etapa,
    taxa: Number(((f.valor / (funil[i]?.valor ?? f.valor)) * 100).toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Comercial" description="Análise de performance do time de vendas" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Receita total" value={formatBRL(receitaTotal)} delta={6.8} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Meta x realizado" value={`${Math.round((receitaTotal / metaTotal) * 100)}%`} hint={formatBRL(metaTotal)} icon={<Target className="h-4 w-4" />} />
        <KpiCard label="Ticket médio" value={formatBRL(k.ticketMedio)} delta={2.8} icon={<Gauge className="h-4 w-4" />} />
        <KpiCard label="Tempo médio de fechamento" value={`${cicloMedio} dias`} delta={-4.5} tone="success" icon={<Clock className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Receita por vendedor" subtitle="Realizado x meta individual" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={receitaPorVendedor}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="vendedor" stroke="var(--muted-foreground)" fontSize={10} interval={0} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatBRL(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="receita" name="Realizado" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="meta" name="Meta" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Conversão por etapa" subtitle="Taxa de passagem entre etapas do funil" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversaoEtapas}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="etapa" stroke="var(--muted-foreground)" fontSize={10} interval={0} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} unit="%" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="taxa" name="Conversão" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Motivos de perda" subtitle="Distribuição das oportunidades perdidas" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={motivosPerda} dataKey="valor" nameKey="motivo" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {motivosPerda.map((_, i) => (
                    <Cell key={i} fill={cores[i % cores.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Performance individual" subtitle="Atingimento, negócios ganhos e ciclo médio" />
          </CardHeader>
          <CardContent className="space-y-4">
            {receitaPorVendedor.map((v) => {
              const pct = Math.round((v.receita / v.meta) * 100);
              return (
                <div key={v.vendedor} className="space-y-1.5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate text-sm font-semibold">{v.vendedor}</p>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {formatBRL(v.receita)} · {v.ganhos} ganhos · {v.cicloDias}d
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={Math.min(pct, 100)} className="h-2" />
                    <span className="w-10 shrink-0 text-right text-xs font-bold tabular-nums">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
