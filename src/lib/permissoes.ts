import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DB = Database["public"]["Tables"];

export type Organizacao = DB["organizacoes"]["Row"];
export type Equipe = DB["equipes"]["Row"];
export type Membro = DB["membros"]["Row"];
export type PermissaoPapel = DB["permissoes_papel"]["Row"];
export type Papel = Database["public"]["Enums"]["app_papel"];

export const papeis: Papel[] = ["administrador", "gestor", "vendedor", "visualizador"];

export const papelLabel: Record<Papel, string> = {
  administrador: "Administrador",
  gestor: "Gestor",
  vendedor: "Vendedor",
  visualizador: "Visualizador",
};

export const papelDescricao: Record<Papel, string> = {
  administrador: "Acesso total à empresa, usuários, configurações, integrações, auditoria e relatórios.",
  gestor: "Gerencia a própria equipe, carteira, metas, atividades e relatórios.",
  vendedor: "Vê seus próprios leads, clientes, oportunidades, tarefas e metas.",
  visualizador: "Somente leitura dos registros permitidos.",
};

export const acoes = [
  "visualizar",
  "criar",
  "editar",
  "excluir",
  "exportar",
  "importar",
  "enviar_mensagens",
  "relatorios",
  "gerenciar_usuarios",
  "configurar_integracoes",
  "auditoria",
] as const;
export type Acao = (typeof acoes)[number];

export const acaoLabel: Record<Acao, string> = {
  visualizar: "Visualizar",
  criar: "Criar",
  editar: "Editar",
  excluir: "Excluir",
  exportar: "Exportar",
  importar: "Importar",
  enviar_mensagens: "Enviar mensagens",
  relatorios: "Acessar relatórios",
  gerenciar_usuarios: "Gerenciar usuários",
  configurar_integracoes: "Configurar integrações",
  auditoria: "Acessar auditoria",
};

/** Vínculo do usuário logado: organização, equipe e papel. */
export function useMembroAtual() {
  return useQuery({
    queryKey: ["membro-atual"],
    queryFn: async (): Promise<Membro | null> => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data, error } = await supabase
        .from("membros")
        .select("*")
        .eq("user_id", auth.user.id)
        .eq("ativo", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
}

export function useOrganizacao() {
  return useQuery({
    queryKey: ["organizacao"],
    queryFn: async (): Promise<Organizacao | null> => {
      const { data, error } = await supabase.from("organizacoes").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
}

export function useEquipes() {
  return useQuery({
    queryKey: ["equipes"],
    queryFn: async (): Promise<Equipe[]> => {
      const { data, error } = await supabase.from("equipes").select("*").order("nome");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useMembros() {
  return useQuery({
    queryKey: ["membros"],
    queryFn: async (): Promise<Membro[]> => {
      const { data, error } = await supabase
        .from("membros")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

export function usePermissoes() {
  return useQuery({
    queryKey: ["permissoes-papel"],
    queryFn: async (): Promise<PermissaoPapel[]> => {
      const { data, error } = await supabase.from("permissoes_papel").select("*");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

/**
 * Verificação de permissão para a interface. O backend continua sendo a
 * fonte de verdade (RLS por organização, equipe e dono do registro).
 */
export function usePermissao() {
  const { data: membro, isLoading: carregandoMembro } = useMembroAtual();
  const { data: matriz, isLoading: carregandoMatriz } = usePermissoes();

  const papel = membro?.papel ?? null;

  const pode = (acao: Acao) => {
    if (!papel) return false;
    const regra = matriz?.find((m) => m.papel === papel && m.acao === acao);
    return regra?.permitido ?? papel === "administrador";
  };

  return {
    membro: membro ?? null,
    papel,
    pode,
    isAdmin: papel === "administrador",
    isGestor: papel === "gestor",
    carregando: carregandoMembro || carregandoMatriz,
  };
}

export function useSalvarEquipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { id?: string; nome: string; descricao?: string | null }) => {
      if (values.id) {
        const { error } = await supabase
          .from("equipes")
          .update({ nome: values.nome, descricao: values.descricao ?? null })
          .eq("id", values.id);
        if (error) throw error;
        return;
      }
      const { data: org } = await supabase.from("organizacoes").select("id").limit(1).maybeSingle();
      if (!org) throw new Error("Organização não encontrada.");
      const { error } = await supabase
        .from("equipes")
        .insert({ org_id: org.id, nome: values.nome, descricao: values.descricao ?? null });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["equipes"] });
      toast.success("Equipe salva");
    },
    onError: (e: Error) => toast.error("Não foi possível salvar a equipe", { description: e.message }),
  });
}

export function useAtualizarMembro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Pick<Membro, "papel" | "equipe_id" | "ativo" | "nome">>;
    }) => {
      const { error } = await supabase.from("membros").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["membros"] });
      void qc.invalidateQueries({ queryKey: ["membro-atual"] });
      toast.success("Usuário atualizado");
    },
    onError: (e: Error) => toast.error("Não foi possível atualizar o usuário", { description: e.message }),
  });
}

export function useAtualizarPermissao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, permitido }: { id: string; permitido: boolean }) => {
      const { error } = await supabase.from("permissoes_papel").update({ permitido }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["permissoes-papel"] });
    },
    onError: (e: Error) =>
      toast.error("Não foi possível alterar a permissão", { description: e.message }),
  });
}
