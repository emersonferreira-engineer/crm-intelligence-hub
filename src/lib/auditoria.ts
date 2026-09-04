import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type EventoAuditoria = Database["public"]["Tables"]["auditoria"]["Row"];

export const acaoAuditoriaLabel: Record<string, string> = {
  criacao: "Criação",
  alteracao: "Alteração",
  exclusao: "Exclusão",
  mudanca_etapa: "Mudança de etapa/status",
  atribuicao: "Atribuição",
  alteracao_valor: "Alteração de valor",
};

export const entidadeLabel: Record<string, string> = {
  leads: "Lead",
  clientes: "Cliente",
  empresas: "Empresa",
  oportunidades: "Oportunidade",
  vendas: "Venda",
  atividades: "Atividade",
};

export const origemLabel: Record<string, string> = {
  interface: "Interface",
  api: "API",
  importacao: "Importação",
  automacao: "Automação",
};

export type FiltroAuditoria = {
  entidade?: string;
  acao?: string;
  usuario?: string;
  busca?: string;
  desde?: string;
};

/** Auditoria global da organização (visível conforme permissão). */
export function useAuditoria(filtro: FiltroAuditoria = {}, limite = 300) {
  return useQuery({
    queryKey: ["auditoria", filtro, limite],
    queryFn: async (): Promise<EventoAuditoria[]> => {
      let query = supabase
        .from("auditoria")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limite);

      if (filtro.entidade) query = query.eq("entidade", filtro.entidade);
      if (filtro.acao) query = query.eq("acao", filtro.acao);
      if (filtro.usuario) query = query.eq("usuario_nome", filtro.usuario);
      if (filtro.desde) query = query.gte("created_at", filtro.desde);

      const { data, error } = await query;
      if (error) throw error;

      const termo = filtro.busca?.trim().toLowerCase();
      const rows = data ?? [];
      if (!termo) return rows;
      return rows.filter((r) =>
        [r.registro_titulo, r.campo, r.valor_anterior, r.valor_novo, r.usuario_nome]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(termo)),
      );
    },
    staleTime: 10_000,
  });
}

/** Histórico de alterações de um registro específico. */
export function useTimelineRegistro(entidade: string, registroId?: string | null) {
  return useQuery({
    queryKey: ["auditoria-registro", entidade, registroId],
    enabled: Boolean(registroId),
    queryFn: async (): Promise<EventoAuditoria[]> => {
      const { data, error } = await supabase
        .from("auditoria")
        .select("*")
        .eq("entidade", entidade)
        .eq("registro_id", registroId!)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5_000,
  });
}

export function formatarDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
