import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { campanhas, formatBRL, formatNum } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/marketing/campanhas")({
  head: () => ({
    meta: [
      { title: "Campanhas | CRM Intelligence Hub" },
      { name: "description", content: "Todas as campanhas de marketing com investimento, leads, conversões e ROAS." },
      { property: "og:title", content: "Campanhas | CRM Intelligence Hub" },
      { property: "og:description", content: "Performance de campanhas por canal em uma única visão." },
    ],
  }),
  component: CampanhasPage,
});

function CampanhasPage() {
  const rows = campanhas.map((c) => ({
    ...c,
    cpl: c.investimento / c.leads,
    roas: c.receita / c.investimento,
    conversao: (c.conversoes / c.leads) * 100,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Campanhas"
        description={`${rows.length} campanhas ativas · ${formatBRL(campanhas.reduce((s, c) => s + c.investimento, 0))} investidos`}
      />
      <Card className="border-border/70 shadow-card">
        <CardContent className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Campanha</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Investimento</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>CPL</TableHead>
                  <TableHead>Conversões</TableHead>
                  <TableHead>Taxa conv.</TableHead>
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
                    <TableCell className="tabular-nums">{formatNum(c.leads)}</TableCell>
                    <TableCell className="tabular-nums">{formatBRL(c.cpl)}</TableCell>
                    <TableCell className="tabular-nums">{c.conversoes}</TableCell>
                    <TableCell className="tabular-nums">{c.conversao.toFixed(1)}%</TableCell>
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
          <p className="text-xs text-muted-foreground">
            Métricas detalhadas de mídia paga em{" "}
            <Link to="/marketing/trafego" className="font-semibold text-primary underline-offset-4 hover:underline">
              Tráfego Pago
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
