import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Mail, Phone, ListChecks } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { atividades } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/comercial/atividades")({
  head: () => ({
    meta: [
      { title: "Atividades | CRM Intelligence Hub" },
      { name: "description", content: "Agenda comercial com ligações, reuniões, e-mails e tarefas do time." },
      { property: "og:title", content: "Atividades | CRM Intelligence Hub" },
      { property: "og:description", content: "Follow-ups e tarefas com SLA por responsável." },
    ],
  }),
  component: AtividadesPage,
});

const icones: Record<string, typeof Mail> = {
  Ligação: Phone,
  Reunião: CalendarCheck,
  Email: Mail,
  Tarefa: ListChecks,
};

const statusClass: Record<string, string> = {
  Pendente: "bg-warning/18 text-warning-foreground",
  Agendada: "bg-primary/10 text-primary",
  Atrasada: "bg-destructive/12 text-destructive",
};

function AtividadesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Atividades" description={`${atividades.length} atividades na semana`} />
      <Card className="border-border/70 shadow-card">
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Tipo</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Relacionado a</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atividades.map((a) => {
                  const Icon = icones[a.tipo] ?? ListChecks;
                  return (
                    <TableRow key={a.id} className="hover:bg-muted/40">
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                          <Icon className="h-3.5 w-3.5 text-primary" /> {a.tipo}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{a.assunto}</TableCell>
                      <TableCell className="text-muted-foreground">{a.relacionado}</TableCell>
                      <TableCell className="text-muted-foreground">{a.responsavel}</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {new Date(a.vencimento).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${statusClass[a.status] ?? "bg-muted"}`}>
                          {a.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
