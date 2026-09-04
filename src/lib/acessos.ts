import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Acesso = Database["public"]["Tables"]["acessos"]["Row"];

/** Domínio corporativo único permitido para todos os integrantes. */
export const DOMINIO_PERMITIDO = "crmhub.com";

export function emailDoDominio(email: string) {
  return email.trim().toLowerCase().endsWith(`@${DOMINIO_PERMITIDO}`);
}

/** Registra no histórico que o usuário logado acessou a plataforma. */
export async function registrarAcesso(metodo: "Senha" | "Google") {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return;

  const { data: perfil } = await supabase.from("perfis").select("nome").eq("id", user.id).maybeSingle();

  const nome =
    perfil?.nome ??
    (user.user_metadata?.["nome"] as string | undefined) ??
    (user.user_metadata?.["full_name"] as string | undefined) ??
    user.email?.split("@")[0] ??
    "Usuário";

  await supabase.from("acessos").insert({ user_id: user.id, nome, email: user.email ?? null, metodo });
}

/** Histórico de acessos de toda a equipe (mais recentes primeiro). */
export function useAcessos(limite = 30) {
  return useQuery({
    queryKey: ["acessos", limite],
    queryFn: async (): Promise<Acesso[]> => {
      const { data, error } = await supabase
        .from("acessos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limite);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 15_000,
  });
}
