import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DB = Database["public"]["Tables"];

export type Perfil = DB["perfis"]["Row"];
export type Empresa = DB["empresas"]["Row"];
export type Cliente = DB["clientes"]["Row"];
export type Lead = DB["leads"]["Row"];
export type Campanha = DB["campanhas"]["Row"];
export type Oportunidade = DB["oportunidades"]["Row"];
export type Venda = DB["vendas"]["Row"];
export type Atividade = DB["atividades"]["Row"];
export type Curso = DB["cursos"]["Row"];
export type Documento = DB["documentos"]["Row"];
export type Financeiro = DB["financeiro_mensal"]["Row"];

export type TableName =
  | "perfis"
  | "empresas"
  | "clientes"
  | "leads"
  | "campanhas"
  | "oportunidades"
  | "vendas"
  | "atividades"
  | "cursos"
  | "documentos"
  | "financeiro_mensal";

/* Domínios usados em filtros e formulários — mantidos em um só lugar. */
export const leadStatuses = [
  "Novo",
  "Contatado",
  "Qualificado",
  "Reunião marcada",
  "Proposta enviada",
  "Negociação",
  "Ganho",
  "Perdido",
] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const etapas = ["Novo Lead", "Qualificação", "Reunião", "Proposta", "Negociação", "Fechado"] as const;
export type Etapa = (typeof etapas)[number];

export const canais = ["Google Ads", "Meta Ads", "Orgânico", "Email Marketing", "Indicação", "Evento"] as const;
export const origens = canais;
export const riscos = ["Baixo", "Médio", "Alto"] as const;
export const statusCurso = ["Não iniciado", "Em andamento", "Concluído"] as const;
export const categoriasCurso = ["IA", "Marketing", "Dados", "Automação"] as const;
export const tiposAtividade = ["Ligação", "Reunião", "Email", "Tarefa"] as const;
export const statusAtividade = ["Pendente", "Agendada", "Concluída", "Atrasada"] as const;
export const responsaveis = [
  "Emerson Ferreira",
  "Ana Ribeiro",
  "Bruno Tavares",
  "Camila Duarte",
  "Diego Moraes",
  "Elisa Nunes",
] as const;

const order: Partial<Record<TableName, { column: string; ascending: boolean }>> = {
  financeiro_mensal: { column: "mes_ref", ascending: true },
  vendas: { column: "data_venda", ascending: false },
  leads: { column: "created_at", ascending: false },
};

async function fetchRows(table: TableName) {
  const o = order[table] ?? { column: "created_at", ascending: false };
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(o.column, { ascending: o.ascending });
  if (error) throw error;
  return data ?? [];
}

/** Lista reativa de uma tabela do CRM. */
export function useRows<T extends TableName>(table: T) {
  return useQuery({
    queryKey: [table],
    queryFn: () => fetchRows(table) as Promise<DB[T]["Row"][]>,
    staleTime: 15_000,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["perfil"],
    queryFn: async (): Promise<Perfil | null> => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data, error } = await supabase.from("perfis").select("*").eq("id", auth.user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
}

/** Invalida tudo que depende de dados (métricas são sempre derivadas). */
function invalidateAll(qc: ReturnType<typeof useQueryClient>, table: TableName) {
  void qc.invalidateQueries({ queryKey: [table] });
}

export function useUpdateRow<T extends TableName>(table: T) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<DB[T]["Update"]> }) => {
      const query = supabase.from(table) as unknown as {
        update: (v: unknown) => { eq: (c: string, v: string) => Promise<{ error: Error | null }> };
      };
      const { error } = await query.update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll(qc, table);
      toast.success("Alteração salva", { description: "Indicadores recalculados." });
    },
    onError: (e: Error) => toast.error("Não foi possível salvar", { description: e.message }),
  });
}

export function useInsertRow<T extends TableName>(table: T) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: DB[T]["Insert"]) => {
      const { data, error } = await supabase
        .from(table)
        .insert(values as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAll(qc, table);
      toast.success("Registro criado");
    },
    onError: (e: Error) => toast.error("Não foi possível criar", { description: e.message }),
  });
}

export function useDeleteRow<T extends TableName>(table: T) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const query = supabase.from(table) as unknown as {
        delete: () => { eq: (c: string, v: string) => Promise<{ error: Error | null }> };
      };
      const { error } = await query.delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll(qc, table);
      toast.success("Registro removido");
    },
    onError: (e: Error) => toast.error("Não foi possível remover", { description: e.message }),
  });
}
