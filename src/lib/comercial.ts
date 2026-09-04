import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DB = Database["public"]["Tables"];

export type Cadencia = DB["cadencias"]["Row"];
export type CadenciaEtapa = DB["cadencia_etapas"]["Row"];
export type Meta = DB["metas"]["Row"];

export const canaisCadencia = ["Email", "Ligação", "WhatsApp", "LinkedIn", "Reunião"] as const;

/** Primeiro dia do mês de uma data ISO (chave usada nas metas). */
export const mesRef = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;

export const mesLongo = (iso: string) => {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(d);
};

/* --------------------------------- Cadências -------------------------------- */

export function useCadencias() {
  return useQuery({
    queryKey: ["cadencias"],
    queryFn: async (): Promise<Cadencia[]> => {
      const { data, error } = await supabase.from("cadencias").select("*").order("nome");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useEtapasCadencia() {
  return useQuery({
    queryKey: ["cadencia-etapas"],
    queryFn: async (): Promise<CadenciaEtapa[]> => {
      const { data, error } = await supabase
        .from("cadencia_etapas")
        .select("*")
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

function useInvalidarCadencias() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ["cadencias"] });
    void qc.invalidateQueries({ queryKey: ["cadencia-etapas"] });
  };
}

export function useSalvarCadencia() {
  const invalidar = useInvalidarCadencias();
  return useMutation({
    mutationFn: async (values: {
      id?: string;
      nome: string;
      descricao?: string | null;
      canal_padrao?: string;
      ativo?: boolean;
    }) => {
      const payload = {
        nome: values.nome,
        descricao: values.descricao ?? null,
        canal_padrao: values.canal_padrao ?? "Email",
        ativo: values.ativo ?? true,
      };
      if (values.id) {
        const { error } = await supabase.from("cadencias").update(payload).eq("id", values.id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("cadencias").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidar();
      toast.success("Cadência salva");
    },
    onError: (e: Error) => toast.error("Não foi possível salvar a cadência", { description: e.message }),
  });
}

export function useSalvarEtapa() {
  const invalidar = useInvalidarCadencias();
  return useMutation({
    mutationFn: async (values: {
      id?: string;
      cadencia_id: string;
      ordem: number;
      dias_apos: number;
      canal: string;
      assunto: string;
      roteiro?: string | null;
    }) => {
      const { id, ...payload } = values;
      if (id) {
        const { error } = await supabase.from("cadencia_etapas").update(payload).eq("id", id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("cadencia_etapas").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidar();
      toast.success("Etapa salva");
    },
    onError: (e: Error) => toast.error("Não foi possível salvar a etapa", { description: e.message }),
  });
}

export function useRemoverEtapa() {
  const invalidar = useInvalidarCadencias();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cadencia_etapas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidar();
      toast.success("Etapa removida");
    },
    onError: (e: Error) => toast.error("Não foi possível remover a etapa", { description: e.message }),
  });
}

export function useRemoverCadencia() {
  const invalidar = useInvalidarCadencias();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cadencias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidar();
      toast.success("Cadência removida");
    },
    onError: (e: Error) => toast.error("Não foi possível remover a cadência", { description: e.message }),
  });
}

const somaDias = (dias: number) => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};

/**
 * Aplica uma cadência a um registro: cria uma atividade de follow-up por etapa,
 * com vencimento calculado a partir de hoje + dias_apos.
 */
export function useAplicarCadencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cadenciaId,
      relacionado,
      responsavel,
    }: {
      cadenciaId: string;
      relacionado: string;
      responsavel: string;
    }) => {
      const { data: etapas, error } = await supabase
        .from("cadencia_etapas")
        .select("*")
        .eq("cadencia_id", cadenciaId)
        .order("ordem", { ascending: true });
      if (error) throw error;
      if (!etapas || etapas.length === 0) throw new Error("Esta cadência ainda não tem etapas.");

      const { data: auth } = await supabase.auth.getUser();

      const atividades = etapas.map((e) => ({
        tipo: e.canal === "Ligação" || e.canal === "Reunião" || e.canal === "Email" ? e.canal : "Tarefa",
        assunto: `[Follow-up ${e.ordem}] ${e.assunto}`,
        relacionado,
        responsavel,
        vencimento: somaDias(e.dias_apos),
        status: "Pendente",
        owner_id: auth.user?.id ?? null,
      }));

      const { error: erroInsert } = await supabase.from("atividades").insert(atividades);
      if (erroInsert) throw erroInsert;
      return atividades.length;
    },
    onSuccess: (qtd) => {
      void qc.invalidateQueries({ queryKey: ["atividades"] });
      toast.success("Cadência aplicada", { description: `${qtd} follow-up(s) agendado(s).` });
    },
    onError: (e: Error) => toast.error("Não foi possível aplicar a cadência", { description: e.message }),
  });
}

/* ----------------------------------- Metas ---------------------------------- */

export function useMetas() {
  return useQuery({
    queryKey: ["metas"],
    queryFn: async (): Promise<Meta[]> => {
      const { data, error } = await supabase
        .from("metas")
        .select("*")
        .order("mes_ref", { ascending: false })
        .order("responsavel", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useSalvarMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: {
      id?: string;
      responsavel: string;
      mes_ref: string;
      meta_receita: number;
      meta_negocios: number;
      meta_leads: number;
    }) => {
      const { id, ...payload } = values;
      if (id) {
        const { error } = await supabase.from("metas").update(payload).eq("id", id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("metas").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["metas"] });
      toast.success("Meta salva", { description: "Atingimento recalculado." });
    },
    onError: (e: Error) => toast.error("Não foi possível salvar a meta", { description: e.message }),
  });
}

export function useRemoverMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("metas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["metas"] });
      toast.success("Meta removida");
    },
    onError: (e: Error) => toast.error("Não foi possível remover a meta", { description: e.message }),
  });
}

/** Atingimento de uma meta a partir dos dados reais do período. */
export interface RealizadoMeta {
  receita: number;
  negocios: number;
  leads: number;
}

export function atingimento(meta: Meta, real: RealizadoMeta) {
  const p = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0);
  return {
    receita: p(real.receita, Number(meta.meta_receita)),
    negocios: p(real.negocios, meta.meta_negocios),
    leads: p(real.leads, meta.meta_leads),
    geral:
      (p(real.receita, Number(meta.meta_receita)) +
        p(real.negocios, meta.meta_negocios) +
        p(real.leads, meta.meta_leads)) /
      3,
  };
}
