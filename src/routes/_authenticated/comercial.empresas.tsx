import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { clientes, formatBRL, leads, oportunidades } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/comercial/empresas")({
  head: () => ({
    meta: [
      { title: "Empresas | CRM Intelligence Hub" },
      { name: "description", content: "Contas e empresas relacionadas a leads, oportunidades e receita." },
      { property: "og:title", content: "Empresas | CRM Intelligence Hub" },
      { property: "og:description", content: "Visão por conta com pipeline aberto e relacionamento." },
    ],
  }),
  component: EmpresasPage,
});

function EmpresasPage() {
  const nomes = Array.from(new Set([...leads.map((l) => l.empresa), ...clientes.map((c) => c.empresa)]));
  const rows = nomes.map((empresa) => {
    const ops = oportunidades.filter((o) => o.cliente === empresa);
    const cli = clientes.find((c) => c.empresa === empresa);
    return {
      empresa,
      segmento: cli?.segmento ?? "Prospect",
      contatos: leads.filter((l) => l.empresa === empresa).length + (cli ? 1 : 0),
      oportunidades: ops.length,
      pipeline: ops.reduce((s, o) => s + o.valor, 0),
      relacionamento: cli ? "Cliente" : "Prospect",
    };
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Empresas" description={`${rows.length} contas mapeadas no CRM`} />
      <Card className="border-border/70 shadow-card">
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Empresa</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Contatos</TableHead>
                  <TableHead>Oportunidades</TableHead>
                  <TableHead>Pipeline aberto</TableHead>
                  <TableHead>Relacionamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.empresa} className="hover:bg-muted/40">
                    <TableCell className="font-semibold">{r.empresa}</TableCell>
                    <TableCell className="text-muted-foreground">{r.segmento}</TableCell>
                    <TableCell className="tabular-nums">{r.contatos}</TableCell>
                    <TableCell className="tabular-nums">{r.oportunidades}</TableCell>
                    <TableCell className="tabular-nums">{formatBRL(r.pipeline)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          r.relacionamento === "Cliente"
                            ? "rounded-md bg-success/12 px-2 py-0.5 text-xs font-semibold text-success"
                            : "rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground"
                        }
                      >
                        {r.relacionamento}
                      </span>
                    </TableCell>
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
