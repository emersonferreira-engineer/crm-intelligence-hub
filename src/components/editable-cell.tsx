import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Célula editável: qualquer valor de tabela pode ser alterado inline e as
 * métricas derivadas são recalculadas assim que o valor é salvo.
 */
export function EditableCell({
  value,
  onSave,
  type = "text",
  align = "left",
  format,
  className,
}: {
  value: string | number | null;
  onSave: (value: string | number) => void;
  type?: "text" | "number" | "date";
  align?: "left" | "right";
  format?: (v: number) => string;
  className?: string;
}) {
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState(String(value ?? ""));

  useEffect(() => setRascunho(String(value ?? "")), [value]);

  const confirmar = () => {
    setEditando(false);
    const proximo = type === "number" ? Number(rascunho.replace(",", ".")) || 0 : rascunho;
    if (String(proximo) !== String(value ?? "")) onSave(proximo);
  };

  if (editando) {
    return (
      <Input
        autoFocus
        type={type}
        value={rascunho}
        onChange={(e) => setRascunho(e.target.value)}
        onBlur={confirmar}
        onKeyDown={(e) => {
          if (e.key === "Enter") confirmar();
          if (e.key === "Escape") {
            setRascunho(String(value ?? ""));
            setEditando(false);
          }
        }}
        className={cn("h-8 w-full min-w-20 px-2 text-sm", align === "right" && "text-right", className)}
      />
    );
  }

  const exibicao =
    type === "number" && format ? format(Number(value ?? 0)) : String(value ?? "—");

  return (
    <button
      type="button"
      onClick={() => setEditando(true)}
      title="Clique para editar"
      className={cn(
        "w-full rounded-md px-2 py-1 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        align === "right" ? "text-right tabular-nums" : "text-left",
        className,
      )}
    >
      {exibicao}
    </button>
  );
}

/** Seletor editável para campos de domínio fechado (status, etapa, canal...). */
export function EditableSelect({
  value,
  options,
  onSave,
  className,
}: {
  value: string;
  options: readonly string[];
  onSave: (value: string) => void;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => v !== value && onSave(v)}>
      <SelectTrigger className={cn("h-8 w-full min-w-32 text-sm", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
