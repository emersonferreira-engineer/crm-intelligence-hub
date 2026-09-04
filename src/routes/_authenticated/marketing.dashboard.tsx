import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, MousePointerClick, Target, UserPlus, Users, Wallet } from "lucide-react";

import { KpiCard } from "@/components/kpi-card";
import { PageHeader, SectionCardTitle } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { canaisConversao, formatBRL, formatNum, kpisGerais as k, receitaMensal } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/marketing/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Marketing | CRM Intelligence Hub" },
      { name: "description", content: "Indicadores de aquisição: visitantes, sessões, leads, CPL, CPA, CAC e ROAS." },
      { property: "og:title", content: "Dashboard Marketing | CRM Intelligence Hub" },
      { property: "og:description", content: "Painel de marketing com comparativo entre canais de aquisição." },
    ],
  }),
  component: DashboardMarketing,
});

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--card-foreground)",
};

function DashboardMarketing() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Marketing" description="Aquisição, mídia paga e eficiência de investimento" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Visitantes" value={formatNum(184320)} delta={11.2} icon={<Eye className="h-4 w-4" />} />
        <KpiCard label="Sessões" value={formatNum(246110)} delta={9.8} icon={<MousePointerClick className="h-4 w-4" />} />
        <KpiCard label="Leads" value={formatNum(k.leadsGerados)} delta={9.4} icon={<UserPlus className="h-4 w-4" />} />
        <KpiCard label="Conversões" value={formatNum(286)} delta={5.1} icon={<Target className="h-4 w-4" />} />
        <KpiCard label="CPL" value={formatBRL(k.cpl)} delta={-3.2} tone="success" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="CPA" value={formatBRL(498)} delta={-2.4} tone="success" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="CAC" value={formatBRL(k.cac)} delta={-1.9} tone="success" icon={<Users className="h-4 w-4" />} />
        <KpiCard label="ROAS" value={`${k.roas}x`} delta={5.5} tone="success" icon={<Target className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Investimento x leads" subtitle="Evolução mensal" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={receitaMensal}>
                <defs>
                  <linearGradient id="gradInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="investimento" name="Investimento" stroke="var(--chart-4)" strokeWidth={2.5} fill="url(#gradInv)" />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="var(--chart-2)" strokeWidth={2.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <SectionCardTitle title="Comparativo de canais" subtitle="Google Ads · Meta Ads · Orgânico · Email" />
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={canaisConversao}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="canal" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="leads" name="Leads" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="conversao" name="Conversão %" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {canaisConversao.map((c) => (
          <Card key={c.canal} className="gap-1 border-border/70 p-4 shadow-card">
            <p className="text-sm font-bold">{c.canal}</p>
            <p className="text-xs text-muted-foreground">{formatNum(c.leads)} leads · {c.conversao}% conversão</p>
            <p className="mt-2 font-display text-xl font-extrabold tabular-nums">{formatBRL(c.receita)}</p>
            <p className="text-xs text-muted-foreground">
              ROAS {(c.receita / c.investimento).toFixed(1)}x · investimento {formatBRL(c.investimento)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
