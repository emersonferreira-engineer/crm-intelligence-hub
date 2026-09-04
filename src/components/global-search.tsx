import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Building2, GraduationCap, Megaphone, Target, Users } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRows } from "@/lib/crm";
import { formatBRL } from "@/lib/calc";

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { data: leads = [] } = useRows("leads");
  const { data: clientes = [] } = useRows("clientes");
  const { data: campanhas = [] } = useRows("campanhas");
  const { data: oportunidades = [] } = useRows("oportunidades");
  const { data: cursos = [] } = useRows("cursos");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const ir = (to: string) => {
    onOpenChange(false);
    void navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar leads, clientes, campanhas, oportunidades, cursos..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Leads">
          {leads.slice(0, 8).map((l) => (
            <CommandItem key={l.id} value={`${l.nome} ${l.empresa ?? ""}`} onSelect={() => ir("/comercial/leads")}>
              <Users className="mr-2 h-4 w-4" />
              <span className="truncate">{l.nome}</span>
              <span className="ml-auto text-xs text-muted-foreground">{l.empresa}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Clientes">
          {clientes.map((c) => (
            <CommandItem key={c.id} value={`${c.empresa} ${c.contato ?? ""}`} onSelect={() => ir("/clientes")}>
              <Building2 className="mr-2 h-4 w-4" />
              <span className="truncate">{c.empresa}</span>
              <span className="ml-auto text-xs text-muted-foreground">{formatBRL(Number(c.ltv))}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Campanhas">
          {campanhas.map((c) => (
            <CommandItem key={c.id} value={c.nome} onSelect={() => ir("/marketing/campanhas")}>
              <Megaphone className="mr-2 h-4 w-4" />
              <span className="truncate">{c.nome}</span>
              <span className="ml-auto text-xs text-muted-foreground">{c.canal}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Oportunidades">
          {oportunidades.slice(0, 8).map((o) => (
            <CommandItem key={o.id} value={o.cliente} onSelect={() => ir("/comercial/oportunidades")}>
              <Target className="mr-2 h-4 w-4" />
              <span className="truncate">{o.cliente}</span>
              <span className="ml-auto text-xs text-muted-foreground">{formatBRL(Number(o.valor))}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Estudos">
          {cursos.slice(0, 6).map((c) => (
            <CommandItem key={c.id} value={c.nome} onSelect={() => ir("/estudos")}>
              <GraduationCap className="mr-2 h-4 w-4" />
              <span className="truncate">{c.nome}</span>
              <span className="ml-auto text-xs text-muted-foreground">{c.categoria}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
