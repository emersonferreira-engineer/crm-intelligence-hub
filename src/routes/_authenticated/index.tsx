import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BadgePercent,
  Banknote,
  Gauge,
  Megaphone,
  MousePointerClick,
  Target,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import { KpiCard } from "@/components/kpi-card";
import { PageHeader, SectionCardTitle } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  canaisConversao,
  formatBRL,
  formatNum,
  funil,
  kpisGerais as k,
  receitaMensal,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Dashboard Geral | CRM Intelligence Hub" },
      {
        name: "description",
        content:
          "Visão executiva de receita, pipeline, leads e performance de marketing em um único painel de BI.",
      },
      { property: "og:title", content: "Dashboard Geral | CRM Intelligence Hub" },
      {
        property: "og:description",
        content: "Indicadores comerciais e de marketing consolidados em tempo real.",
      },
    ],
  }),
  component: DashboardGeral,
});

const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--card-foreground)",
};

function DashboardGeral() {
  const atingimento = Math.round((k.receitaMensal / k.meta) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Geral"
        description="Visão executiva consolidada de comercial, marketing e carteira de clientes."
      />

      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Comercial</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Receita mensal" value={formatBRL(k.receitaMensal)} delta={7.6} icon={<Banknote className="h-4 w-4" />} />
          <KpiCard label="Receita acumulada" value={formatBRL(k.receitaAcumulada)} hint="Ano corrente" icon={<Wallet className="h-4 w-4" />} />
          <KpiCard label="Oportunidades abertas" value={formatNum(k.oportunidades)} delta={4.2} icon={<Target className="h-4 w-4" />} />
          <KpiCard label="Taxa de conversão" value={`${k.taxaConversao}%`} delta={1.1} icon={<BadgePercent className="h-4 w-4" />} />
          <KpiCard label="Ticket médio" value={formatBRL(k.ticketMedio)} delta={2.8} icon={<Gauge className="h-4 w-4" />} />
          <KpiCard label="Forecast de vendas" value={formatBRL(k.forecast)} hint="Próximos 30 dias" tone="success" icon={<TrendingUp className="h-4 w-4" />} />
          <Card className="gap-2 border-border/70 p-4 shadow-card sm:col-span-2">
            <SectionCardTitle title="Meta x Realizado" subtitle={`Meta de ${formatBRL(k.meta)} no mês`} />
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="font-display text-2xl font-extrabold tabular-nums">{atingimento}%</p>
              <p className="text-sm text-muted-foreground">{formatBRL(k.receitaMensal)}</p>
            </div>
            <Progress value={Math.min(atingimento, 100)} className="mt-2 h-2" />
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Marketing</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Investimento" value={formatBRL(k.investimentoMarketing)} delta={6} icon={<Megaphone className="h-4 w-4" />} />
          <KpiCard label="Leads gerados" value={formatNum(k.leadsGerados)} delta={9.4} icon={<UserPlus className="h-4 w-4" />} />
          <KpiCard label="CPL" value={formatBRL(k.cpl)} delta={-3.2} icon={<MousePointerClick className="h-4 w-4" />} />
          <KpiCard label="CAC" value={formatBRL(k.cac)} delta={-1.9} icon={<Users className="h-4 w-4" />} />
          <KpiCard label="ROAS" value={`${k.roas}x`} delta={5.5} tone="success" icon={<TrendingUp className="h-4 w-4" />} />
          <KpiCard label="ROI" value={`${k.roi}%`} delta={8.1} tone="success" icon={<Activity className="h-4 w-4" />} />
          <KpiCard label="Clientes ativos" value={formatNum(k.clientesAtivos)} delta={3.4} icon={<Users className="h-4 w-4" />} />
          <KpiCard label="Churn" value={`${k.churn}%`} delta={-0.4} tone="destructive" icon={<TrendingDown className="h-4 w-4" />} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Evolução de receita" subtitle="Receita realizada x meta mensal" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={receitaMensal}>
                <defs>
                  <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatBRL(v)} />
                <Area type="monotone" dataKey="receita" name="Receita" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#gradReceita)" />
                <Area type="monotone" dataKey="meta" name="Meta" stroke="var(--chart-4)" strokeWidth={2} strokeDasharray="5 4" fillOpacity={0} dot={false} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Evolução de leads" subtitle="Volume de leads gerados por mês" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={receitaMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="leads" name="Leads" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Conversão do funil" subtitle="Do lead ao fechamento" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funil} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="etapa" stroke="var(--muted-foreground)" fontSize={12} width={92} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="valor" name="Volume" radius={[0, 6, 6, 0]}>
                  {funil.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Marketing x Comercial" subtitle="Investimento em mídia x receita gerada por canal" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={canaisConversao}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="canal" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatBRL(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="investimento" name="Investimento" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="receita" name="Receita" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
