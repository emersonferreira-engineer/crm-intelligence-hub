import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditableCell } from "@/components/editable-cell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useUpdateRow } from "@/lib/crm";
import { DOMINIO_PERMITIDO, useAcessos } from "@/lib/acessos";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil | CRM Intelligence Hub" },
      { name: "description", content: "Dados do usuário logado na plataforma CRM Intelligence Hub." },
      { property: "og:title", content: "Meu perfil | CRM Intelligence Hub" },
      { property: "og:description", content: "Gerencie nome, cargo e empresa do seu usuário." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { data: perfil } = useProfile();
  const atualizar = useUpdateRow("perfis");
  const { data: acessos = [], isLoading: carregandoAcessos } = useAcessos(40);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const salvar = (campo: string) => (valor: string | number) => {
    if (!perfil) return;
    atualizar.mutate({ id: perfil.id, values: { [campo]: valor } });
  };

  const alterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      toast.error("Senha muito curta", { description: "Use ao menos 6 caracteres." });
      return;
    }
    if (novaSenha !== confirmar) {
      toast.error("As senhas não coincidem");
      return;
    }
    setSalvandoSenha(true);
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    setSalvandoSenha(false);
    if (error) {
      toast.error("Não foi possível alterar a senha", { description: error.message });
      return;
    }
    setNovaSenha("");
    setConfirmar("");
    toast.success("Senha alterada", { description: "Use a nova senha no próximo acesso." });
  };

  const campos: { label: string; campo: string; valor: string }[] = [
    { label: "Nome", campo: "nome", valor: perfil?.nome ?? "" },
    { label: "Cargo", campo: "cargo", valor: perfil?.cargo ?? "" },
    { label: "Empresa", campo: "empresa", valor: perfil?.empresa ?? "" },
  ];

  const iniciais = (perfil?.nome ?? "EF")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const formatar = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-5">
      <PageHeader title="Meu perfil" description="Informações do usuário logado. Clique em qualquer campo para editar." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="space-y-5 p-5 shadow-card">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {perfil?.avatar_url && <AvatarImage src={perfil.avatar_url} alt={perfil.nome} />}
              <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">{iniciais}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-display text-lg font-extrabold">{perfil?.nome ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{perfil?.email ?? "—"}</p>
            </div>
          </div>

          <div className="divide-y divide-border rounded-lg border border-border">
            {campos.map((c) => (
              <div key={c.campo} className="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2 px-3 py-2">
                <span className="text-sm text-muted-foreground">{c.label}</span>
                <EditableCell value={c.valor} onSave={salvar(c.campo)} />
              </div>
            ))}
            <div className="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2 px-3 py-2">
              <span className="text-sm text-muted-foreground">E-mail</span>
              <span className="px-2 text-sm">{perfil?.email ?? "—"}</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-5 shadow-card">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="font-display text-base font-extrabold">Alterar senha</h2>
          </div>
          <form className="space-y-3" onSubmit={alterarSenha}>
            <div className="space-y-1.5">
              <Label htmlFor="nova-senha">Nova senha</Label>
              <Input
                id="nova-senha"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
              <Input
                id="confirmar-senha"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={salvandoSenha}>
              {salvandoSenha && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar nova senha
            </Button>
          </form>

          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Acesso restrito ao domínio corporativo <strong>@{DOMINIO_PERMITIDO}</strong>. Novos integrantes só
              conseguem criar conta com um e-mail deste domínio.
            </span>
          </div>
        </Card>
      </div>

      <Card className="p-5 shadow-card">
        <div className="mb-4 space-y-1">
          <h2 className="font-display text-base font-extrabold">Histórico de acessos</h2>
          <p className="text-sm text-muted-foreground">
            Todos os logins dos integrantes da equipe, do mais recente para o mais antigo.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-semibold">Usuário</th>
                <th className="py-2 pr-4 font-semibold">E-mail</th>
                <th className="py-2 pr-4 font-semibold">Data e hora</th>
                <th className="py-2 font-semibold">Método</th>
              </tr>
            </thead>
            <tbody>
              {carregandoAcessos && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    Carregando acessos…
                  </td>
                </tr>
              )}
              {!carregandoAcessos && acessos.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    Nenhum acesso registrado ainda.
                  </td>
                </tr>
              )}
              {acessos.map((a) => (
                <tr key={a.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-4 font-medium">{a.nome}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{a.email ?? "—"}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{formatar(a.created_at)}</td>
                  <td className="py-2 text-muted-foreground">{a.metodo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
