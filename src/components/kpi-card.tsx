import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "success" | "warning" | "destructive";
}

export function KpiCard({ label, value, delta, hint, icon, tone = "default" }: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="kpi-surface gap-0 border-border/70 p-4 shadow-card transition-shadow hover:shadow-lg">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </p>
        {icon && (
          <span
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-md",
              tone === "success" && "bg-success/12 text-success",
              tone === "warning" && "bg-warning/18 text-warning-foreground",
              tone === "destructive" && "bg-destructive/12 text-destructive",
              tone === "default" && "bg-primary/10 text-primary",
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-extrabold tabular-nums">{value}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-bold",
              positive ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive",
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toLocaleString("pt-BR")}%
          </span>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </Card>
  );
}
