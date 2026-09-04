import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, History, User } from "lucide-react";

import { EditableCell, EditableSelect } from "@/components/editable-cell";
import { PageHeader } from "@/components/page-header";
import { RegistroTimeline } from "@/components/registro-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dataCurta, formatBRL } from "@/lib/calc";
import { etapas, responsaveis, useRows, useUpdateRow, type Oportunidade } from "@/lib/crm";

export function OportunidadesView({ defaultTab }: { defaultTab: "kanban" | "tabela" }) {
  const [tab, setTab] = useState(defaultTab);
  const { data: oportunidades = [], isLoading } = useRows("oportunidades");
  const atualizar = useUpdateRow("oportunidades");
  const [detalhe, setDetalhe] = useState<Oportunidade | null>(null);

  const salvar = (id: string, campo: string, valor: string | number) =>
    atualizar.mutate({ id, values: { [campo]: valor } as never });

  const porEtapa = useMemo(
    () =>
      etapas.map((etapa) => ({
        etapa,
        itens: oportunidades.filter((o) => o.etapa === etapa),
      })),
    [oportunidades],
  );

  const total = oportunidades.reduce((s, o) => s + Number(o.valor), 0);
  const ponderado = oportunidades.reduce((s, o) => s + (Number(o.valor) * o.probabilidade) / 100, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title={tab === "kanban" ? "Pipeline de vendas" : "Oportunidades"}
        description={`${oportunidades.length} oportunidades · ${formatBRL(total)} em pipeline · ${formatBRL(ponderado)} ponderado`}
        actions={
          <div className="flex gap-2">
            <Button variant={tab === "kanban" ? "default" : "outline"} size="sm" onClick={() => setTab("kanban")}>
              Kanban
            </Button>
            <Button variant={tab === "tabela" ? "default" : "outline"} size="sm" onClick={() => setTab("tabela")}>
              Tabela
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : tab === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-3">
          {porEtapa.map(({ etapa, itens }) => (
            <div key={etapa} className="w-72 shrink-0">
              <div className="mb-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-card">
                <p className="truncate text-sm font-bold">{etapa}</p>
                <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs font-bold tabular-nums">
                  {itens.length}
                </span>
              </div>
              <p className="mb-2 px-1 text-xs text-muted-foreground">
                {formatBRL(itens.reduce((s, o) => s + Number(o.valor), 0))}
              </p>
              <div className="space-y-2">
                {itens.map((o) => (
                  <Card key={o.id} className="gap-2 border-border/70 p-3 shadow-card transition-shadow hover:shadow-lg">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <p className="min-w-0 truncate text-sm font-semibold">{o.cliente}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="Histórico" onClick={() => setDetalhe(o)}>
                        <History className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="font-display text-lg font-extrabold tabular-nums">{formatBRL(Number(o.valor))}</p>
                    <div>
                      <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
                        <span>Probabilidade</span>
                        <span className="font-bold tabular-nums">{o.probabilidade}%</span>
                      </div>
                      <Progress value={o.probabilidade} className="mt-1 h-1.5" />
                    </div>
                    <EditableSelect value={o.etapa} options={etapas} onSave={(v) => salvar(o.id, "etapa", v)} />
                    <div className="flex flex-wrap items-center gap-3 text-[0.7rem] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" /> {o.responsavel}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {dataCurta(o.fechamento_previsto)}
                      </span>
                    </div>
                  </Card>
                ))}
                {itens.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                    Nenhuma oportunidade
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-border/70 shadow-card">
          <CardHeader>
            <p className="text-sm font-bold">Todas as oportunidades</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/60">
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Probabilidade</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Fechamento previsto</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead className="text-right">Histórico</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {oportunidades.map((o) => (
                    <TableRow key={o.id} className="hover:bg-muted/40">
                      <TableCell className="font-semibold">
                        <EditableCell value={o.cliente} onSave={(v) => salvar(o.id, "cliente", v)} />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          type="number"
                          align="right"
                          value={Number(o.valor)}
                          format={formatBRL}
                          onSave={(v) => salvar(o.id, "valor", v)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          type="number"
                          align="right"
                          value={o.probabilidade}
                          onSave={(v) => salvar(o.id, "probabilidade", v)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableSelect
                          value={o.responsavel}
                          options={responsaveis}
                          onSave={(v) => salvar(o.id, "responsavel", v)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          type="date"
                          value={o.fechamento_previsto}
                          onSave={(v) => salvar(o.id, "fechamento_previsto", v)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableSelect value={o.etapa} options={etapas} onSave={(v) => salvar(o.id, "etapa", v)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" title="Histórico" onClick={() => setDetalhe(o)}>
                          <History className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {oportunidades.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhuma oportunidade cadastrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Precisa de mais contexto do cliente?{" "}
              <Link to="/clientes" className="font-semibold text-primary underline-offset-4 hover:underline">
                Ver módulo de clientes
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      <Sheet open={Boolean(detalhe)} onOpenChange={(o) => !o && setDetalhe(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="truncate">{detalhe?.cliente}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            {detalhe && (
              <RegistroTimeline entidade="oportunidades" registroId={detalhe.id} titulo="Histórico da oportunidade" />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
