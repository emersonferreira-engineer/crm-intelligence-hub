import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Repeat, TrendingUp, Users } from "lucide-react";

import { EditableCell, EditableSelect } from "@/components/editable-cell";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { RegistroTimeline } from "@/components/registro-timeline";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dataCurta, formatBRL } from "@/lib/calc";
import { riscos, useRows, useUpdateRow } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes | CRM Intelligence Hub" },
      { name: "description", content: "Carteira de clientes com LTV, frequência de compra, tickets e risco de churn." },
      { property: "og:title", content: "Clientes | CRM Intelligence Hub" },
      { property: "og:description", content: "Histórico de interações, compras e indicadores de retenção." },
    ],
  }),
  component: ClientesPage,
});

const churnClass: Record<string, string> = {
  Baixo: "bg-success/12 text-success",
  Médio: "bg-warning/18 text-warning-foreground",
  Alto: "bg-destructive/12 text-destructive",
};

function ClientesPage() {
  const { data: clientes = [], isLoading } = useRows("clientes");
  const atualizar = useUpdateRow("clientes");
  const [selecionado, setSelecionado] = useState<string | null>(null);

  useEffect(() => {
    if (!selecionado && clientes[0]) setSelecionado(clientes[0].id);
  }, [clientes, selecionado]);

  const cliente = clientes.find((c) => c.id === selecionado) ?? clientes[0] ?? null;
  const total = clientes.length || 1;
  const ltvTotal = clientes.reduce((s, c) => s + Number(c.ltv), 0);
  const frequenciaMedia = clientes.reduce((s, c) => s + c.frequencia_meses, 0) / total;
  const comprasTotais = clientes.reduce((s, c) => s + c.compras, 0);

  const salvar = (id: string, campo: string, valor: string | number) =>
    atualizar.mutate({ id, values: { [campo]: valor } as never });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clientes"
        description={`${clientes.length} contas na carteira · ${formatBRL(ltvTotal)} em LTV · edição inline com recálculo automático`}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Lifetime Value médio" value={formatBRL(ltvTotal / total)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard
          label="Frequência média de compra"
          value={`${frequenciaMedia.toFixed(1)} meses`}
          icon={<Repeat className="h-4 w-4" />}
        />
        <KpiCard label="Compras acumuladas" value={String(comprasTotais)} icon={<Users className="h-4 w-4" />} tone="warning" />
        <KpiCard
          label="Contas em risco"
          value={String(clientes.filter((c) => c.risco_churn === "Alto").length)}
          hint="Risco alto de churn"
          tone="destructive"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      <Card className="border-border/70 shadow-card">
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/60">
                    <TableHead>Empresa</TableHead>
                    <TableHead>Segmento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>LTV</TableHead>
                    <TableHead>Compras</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Último contato</TableHead>
                    <TableHead>Risco de churn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((c) => (
                    <TableRow
                      key={c.id}
                      onClick={() => setSelecionado(c.id)}
                      className={`cursor-pointer hover:bg-muted/40 ${c.id === cliente?.id ? "bg-accent/50" : ""}`}
                    >
                      <TableCell className="font-semibold">
                        <EditableCell value={c.empresa} onSave={(v) => salvar(c.id, "empresa", v)} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <EditableCell value={c.segmento} onSave={(v) => salvar(c.id, "segmento", v)} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <EditableCell value={c.contato} onSave={(v) => salvar(c.id, "contato", v)} />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          type="number"
                          align="right"
                          value={Number(c.ltv)}
                          format={formatBRL}
                          onSave={(v) => salvar(c.id, "ltv", v)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell type="number" align="right" value={c.compras} onSave={(v) => salvar(c.id, "compras", v)} />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          type="number"
                          align="right"
                          value={c.frequencia_meses}
                          onSave={(v) => salvar(c.id, "frequencia_meses", v)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          type="date"
                          value={c.ultimo_contato}
                          onSave={(v) => salvar(c.id, "ultimo_contato", v)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableSelect
                          value={c.risco_churn}
                          options={riscos}
                          onSave={(v) => salvar(c.id, "risco_churn", v)}
                          className={churnClass[c.risco_churn] ?? ""}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {clientes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhum cliente cadastrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {cliente && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card className="border-border/70 shadow-card">
            <CardHeader>
              <h3 className="text-sm font-bold">Histórico de alterações · {cliente.empresa}</h3>
              <p className="text-xs text-muted-foreground">Clique em uma linha da tabela para trocar a conta</p>
            </CardHeader>
            <CardContent>
              <RegistroTimeline entidade="clientes" registroId={cliente.id} titulo="Timeline da conta" />
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-card">
            <CardHeader>
              <h3 className="text-sm font-bold">Ficha da conta</h3>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Info label="Segmento" value={cliente.segmento} />
              <Info label="Contato principal" value={`${cliente.contato ?? "—"} · ${cliente.email ?? "—"}`} />
              <Info label="Lifetime value" value={formatBRL(Number(cliente.ltv))} />
              <Info label="Compras realizadas" value={`${cliente.compras} pedidos`} />
              <Info label="Frequência" value={`${cliente.frequencia_meses} meses`} />
              <Info label="Último contato" value={dataCurta(cliente.ultimo_contato)} />
              <Info
                label="Observações"
                value={
                  <EditableCell
                    value={cliente.observacoes ?? ""}
                    onSave={(v) => salvar(cliente.id, "observacoes", v)}
                  />
                }
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}
