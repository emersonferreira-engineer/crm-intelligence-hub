import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { conteudos, formatNum } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/marketing/conteudos")({
  head: () => ({
    meta: [
      { title: "Conteúdos | CRM Intelligence Hub" },
      { name: "description", content: "Performance de conteúdos: visualizações, leads gerados e taxa de conversão." },
      { property: "og:title", content: "Conteúdos | CRM Intelligence Hub" },
      { property: "og:description", content: "E-books, webinars e cases que mais geram pipeline." },
    ],
  }),
  component: ConteudosPage,
});

function ConteudosPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Conteúdos" description="Materiais que alimentam o topo do funil" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {conteudos.map((c) => (
          <Card key={c.titulo} className="gap-1 border-border/70 p-4 shadow-card">
            <span className="w-fit rounded-md bg-primary/10 px-2 py-0.5 text-[0.7rem] font-bold text-primary">
              {c.tipo}
            </span>
            <p className="mt-2 text-sm font-bold">{c.titulo}</p>
            <p className="text-xs text-muted-foreground">{c.canal}</p>
            <p className="mt-2 font-display text-xl font-extrabold tabular-nums">{formatNum(c.leads)} leads</p>
            <p className="text-xs text-muted-foreground">
              {formatNum(c.visualizacoes)} views · {c.conversao}% conversão
            </p>
          </Card>
        ))}
      </div>

      <Card className="border-border/70 shadow-card">
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Conteúdo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Canal de distribuição</TableHead>
                  <TableHead>Visualizações</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Conversão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conteudos.map((c) => (
                  <TableRow key={c.titulo} className="hover:bg-muted/40">
                    <TableCell className="font-semibold">{c.titulo}</TableCell>
                    <TableCell className="text-muted-foreground">{c.tipo}</TableCell>
                    <TableCell className="text-muted-foreground">{c.canal}</TableCell>
                    <TableCell className="tabular-nums">{formatNum(c.visualizacoes)}</TableCell>
                    <TableCell className="tabular-nums">{formatNum(c.leads)}</TableCell>
                    <TableCell className="tabular-nums">{c.conversao}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
