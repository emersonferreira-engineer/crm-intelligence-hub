import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Bell, LogOut, Moon, Search, Sun, User } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlobalSearch } from "@/components/global-search";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useRows } from "@/lib/crm";
import { dataCurta } from "@/lib/calc";

const labels: Record<string, string> = {
  comercial: "Comercial",
  marketing: "Marketing",
  leads: "Leads",
  contatos: "Contatos",
  empresas: "Empresas",
  oportunidades: "Oportunidades",
  pipeline: "Pipeline",
  atividades: "Atividades",
  dashboard: "Dashboard",
  campanhas: "Campanhas",
  trafego: "Tráfego Pago",
  conteudos: "Conteúdos",
  clientes: "Clientes",
  automacoes: "Automações",
  relatorios: "Relatórios",
  estudos: "Estudos",
  financeiro: "Financeiro",
  "assistente-ia": "Assistente IA",
};

function useTema() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const salvo = window.localStorage.getItem("crm-tema");
    const ativo = salvo ? salvo === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(ativo);
    document.documentElement.classList.toggle("dark", ativo);
  }, []);
  const alternar = () => {
    setDark((prev) => {
      const proximo = !prev;
      document.documentElement.classList.toggle("dark", proximo);
      window.localStorage.setItem("crm-tema", proximo ? "dark" : "light");
      return proximo;
    });
  };
  return { dark, alternar };
}

export function AppTopbar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { dark, alternar } = useTema();
  const { data: perfil } = useProfile();
  const { data: atividades = [] } = useRows("atividades");
  const [buscaAberta, setBuscaAberta] = useState(false);

  const trilha = useMemo(() => pathname.split("/").filter(Boolean), [pathname]);
  const pendentes = atividades.filter((a) => a.status !== "Concluída");

  const sair = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  const iniciais = (perfil?.nome ?? "Emerson Ferreira")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card/85 px-3 py-2.5 backdrop-blur sm:gap-3 sm:px-6">
      <SidebarTrigger />

      <div className="hidden min-w-0 flex-1 md:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Início</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {trilha.map((seg, i) => (
              <span key={seg} className="flex items-center gap-1.5">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {i === trilha.length - 1 ? (
                    <BreadcrumbPage>{labels[seg] ?? seg}</BreadcrumbPage>
                  ) : (
                    <span className="text-muted-foreground">{labels[seg] ?? seg}</span>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => setBuscaAberta(true)}
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Pesquisar</span>
          <kbd className="hidden rounded border border-border px-1 text-[0.65rem] lg:inline">⌘K</kbd>
        </Button>

        <Button variant="ghost" size="icon" onClick={alternar} aria-label="Alternar modo escuro">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
              <Bell className="h-4 w-4" />
              {pendentes.length > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[0.6rem] font-bold text-destructive-foreground">
                  {pendentes.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações · atividades abertas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {pendentes.length === 0 && (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">Nada pendente por aqui.</p>
            )}
            {pendentes.slice(0, 6).map((a) => (
              <DropdownMenuItem key={a.id} asChild>
                <Link to="/comercial/atividades" className="flex flex-col items-start gap-0.5">
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{a.assunto}</span>
                    <Badge variant="outline" className="shrink-0 text-[0.65rem]">
                      {a.status}
                    </Badge>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {a.responsavel} · {dataCurta(a.vencimento)}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-1.5 sm:px-2">
              <Avatar className="h-7 w-7">
                {perfil?.avatar_url && <AvatarImage src={perfil.avatar_url} alt={perfil.nome} />}
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {iniciais}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-xs font-bold">{perfil?.nome ?? "Emerson Ferreira"}</span>
                <span className="block text-[0.68rem] text-muted-foreground">
                  {perfil?.cargo ?? "Analista de Growth Marketing"}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="space-y-0.5">
              <p className="text-sm font-bold">{perfil?.nome ?? "Emerson Ferreira"}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {perfil?.email ?? "emerson@crmhub.com"}
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                {perfil?.empresa ?? "CRM Intelligence Hub"}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/perfil" className="gap-2">
                <User className="h-4 w-4" /> Meu perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={sair} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <GlobalSearch open={buscaAberta} onOpenChange={setBuscaAberta} />
    </header>
  );
}
