import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Novo: "bg-info/12 text-info border-info/25",
  Contatado: "bg-primary/12 text-primary border-primary/25",
  Qualificado: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  "Reunião marcada": "bg-chart-5/15 text-chart-5 border-chart-5/30",
  "Proposta enviada": "bg-warning/18 text-warning-foreground border-warning/40",
  Negociação: "bg-warning/25 text-warning-foreground border-warning/50",
  Ganho: "bg-success/15 text-success border-success/30",
  Perdido: "bg-destructive/12 text-destructive border-destructive/25",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-md font-semibold", map[status] ?? "bg-muted text-muted-foreground")}>
      {status}
    </Badge>
  );
}
