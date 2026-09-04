import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { DOMINIO_PERMITIDO, emailDoDominio, registrarAcesso } from "@/lib/acessos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({

  head: () => ({
    meta: [
      { title: "Acessar | CRM Intelligence Hub" },
      {
        name: "description",
        content:
          "Acesse o CRM Intelligence Hub: plataforma inteligente de CRM, growth marketing, business intelligence e automação.",
      },
      { property: "og:title", content: "Acessar o CRM Intelligence Hub" },
      {
        property: "og:description",
        content: "Plataforma inteligente de CRM, Growth Marketing, Business Intelligence e Automação.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("emerson@crmhub.com");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailDoDominio(email)) {
      toast.error("Domínio não autorizado", { description: `Use um e-mail @${DOMINIO_PERMITIDO}.` });
      return;
    }
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) {
      const semConta = error.message.toLowerCase().includes("invalid login credentials");
      toast.error("Não foi possível entrar", {
        description: semConta
          ? "E-mail ou senha incorretos. Se ainda não tem acesso, use a aba \"Criar conta\"."
          : error.message,
      });
      return;
    }

    await registrarAcesso("Senha");
    void navigate({ to: "/", replace: true });
  };

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailDoDominio(email)) {
      toast.error("Domínio não autorizado", {
        description: `Somente e-mails @${DOMINIO_PERMITIDO} podem criar acesso.`,
      });
      return;
    }
    setCarregando(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: window.location.origin,
        data: { nome: "Emerson Ferreira", cargo: "Analista de Growth Marketing" },
      },
    });
    setCarregando(false);
    if (error) {
      const dominioBloqueado = error.message.toLowerCase().includes("email_domain_not_allowed");
      toast.error("Não foi possível criar a conta", {
        description: dominioBloqueado
          ? `Somente e-mails @${DOMINIO_PERMITIDO} são autorizados pelo servidor.`
          : error.message,
      });
      return;
    }
    if (data.session) {
      await registrarAcesso("Senha");
      void navigate({ to: "/", replace: true });
      return;
    }
    toast.success("Conta criada", { description: "Confirme o e-mail enviado para concluir o acesso." });
  };

  const entrarComGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("Falha no login com Google", { description: String(result.error) });
      return;
    }
    if (result.redirected) return;
    const { data } = await supabase.auth.getUser();
    if (data.user?.email && !emailDoDominio(data.user.email)) {
      await supabase.auth.signOut();
      toast.error("Domínio não autorizado", { description: `Use uma conta @${DOMINIO_PERMITIDO}.` });
      return;
    }
    await registrarAcesso("Google");
    void navigate({ to: "/", replace: true });
  };

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-base font-extrabold">CRM Intelligence Hub</p>
            <p className="text-xs text-sidebar-foreground/60">Enterprise edition</p>
          </div>
        </div>
        <div className="max-w-lg space-y-5">
          <h1 className="font-display text-4xl font-extrabold leading-tight">
            Plataforma Inteligente de CRM, Growth Marketing, Business Intelligence e Automação.
          </h1>
          <p className="text-sm leading-relaxed text-sidebar-foreground/70">
            Pipeline comercial, análise de mídia paga, dashboards executivos e um assistente de IA que responde
            sobre os seus próprios dados — em um único ambiente corporativo.
          </p>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            {[
              "Motor de cálculos automáticos em tempo real",
              "Dashboards dinâmicos estilo Power BI",
              "Base relacional completa de CRM",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sidebar-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-sidebar-foreground/50">© 2026 CRM Intelligence Hub</p>
      </section>

      <section className="flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md border-border/70 p-6 shadow-card">
          <div className="mb-5 space-y-1">
            <h2 className="font-display text-xl font-extrabold">Acessar a plataforma</h2>
            <p className="text-sm text-muted-foreground">
              Use e-mail e senha ou continue com sua conta Google.
            </p>
          </div>

          <Tabs defaultValue="entrar">
            <TabsList className="w-full">
              <TabsTrigger value="entrar" className="flex-1">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="criar" className="flex-1">
                Criar conta
              </TabsTrigger>
            </TabsList>

            {(["entrar", "criar"] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <form className="space-y-3" onSubmit={tab === "entrar" ? entrar : cadastrar}>
                  <div className="space-y-1.5">
                    <Label htmlFor={`email-${tab}`}>E-mail corporativo</Label>
                    <Input
                      id={`email-${tab}`}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="emerson@crmhub.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`senha-${tab}`}>Senha</Label>
                    <Input
                      id={`senha-${tab}`}
                      type="password"
                      required
                      minLength={6}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={carregando}>
                    {carregando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {tab === "entrar" ? "Entrar na plataforma" : "Criar minha conta"}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={entrarComGoogle}>
            Continuar com Google
          </Button>
        </Card>
      </section>
    </main>
  );
}
