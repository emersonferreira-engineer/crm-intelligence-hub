import { AlertCircle, History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { acaoAuditoriaLabel, formatarDataHora, origemLabel, useTimelineRegistro } from "@/lib/auditoria";

const corAcao: Record<string, string> = {
  criacao: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  exclusao: "bg-destructive/15 text-destructive",
  mudanca_etapa: "bg-primary/15 text-primary",
  atribuicao: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  alteracao_valor: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
};

/** Linha do tempo de alterações de um registro (lead, cliente, oportunidade...). */
export function RegistroTimeline({
  entidade,
  registroId,
  titulo = "Timeline do registro",
}: {
  entidade: string;
  registroId?: string | null;
  titulo?: string;
}) {
  const { data, isLoading, isError, error } = useTimelineRegistro(entidade, registroId);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-bold">{titulo}</h3>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {isError && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Não foi possível carregar o histórico: {(error as Error).message}
        </p>
      )}

      {!isLoading && !isError && (data?.length ?? 0) === 0 && (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Nenhuma alteração registrada ainda. Toda edição feita a partir de agora aparece aqui.
        </p>
      )}

      <ol className="space-y-3 border-l pl-4">
        {data?.map((ev) => (
          <li key={ev.id} className="relative">
            <span className="absolute -left-[1.42rem] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={corAcao[ev.acao] ?? "bg-muted text-muted-foreground"}>
                {acaoAuditoriaLabel[ev.acao] ?? ev.acao}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatarDataHora(ev.created_at)}</span>
              <span className="text-xs font-semibold">{ev.usuario_nome ?? "Sistema"}</span>
              <span className="text-[0.68rem] uppercase tracking-wide text-muted-foreground">
                {origemLabel[ev.origem] ?? ev.origem}
              </span>
            </div>
            {ev.campo && (
              <p className="mt-1 text-sm">
                <span className="font-medium">{ev.campo}</span>:{" "}
                <span className="text-muted-foreground line-through">{ev.valor_anterior || "vazio"}</span>{" "}
                → <span className="font-semibold">{ev.valor_novo || "vazio"}</span>
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
