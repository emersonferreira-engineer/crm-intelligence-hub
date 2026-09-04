import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  KanbanSquare,
  CalendarCheck,
  BarChart3,
  Megaphone,
  MousePointerClick,
  FileText,
  Workflow,
  GraduationCap,
  UserCheck,
  ChartPie,
  Sparkles,
  Bot,
  Wallet,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/lib/crm";
import { usePermissao } from "@/lib/permissoes";

type Item = { title: string; url: string; icon: typeof Users };

const geral: Item[] = [
  { title: "Dashboard Geral", url: "/", icon: LayoutDashboard },
  { title: "Assistente IA", url: "/assistente-ia", icon: Bot },
];

const comercial: Item[] = [
  { title: "Leads", url: "/comercial/leads", icon: Users },
  { title: "Contatos", url: "/comercial/contatos", icon: UserCheck },
  { title: "Empresas", url: "/comercial/empresas", icon: Building2 },
  { title: "Oportunidades", url: "/comercial/oportunidades", icon: Target },
  { title: "Pipeline", url: "/comercial/pipeline", icon: KanbanSquare },
  { title: "Atividades", url: "/comercial/atividades", icon: CalendarCheck },
  { title: "Cadências", url: "/comercial/cadencias", icon: Workflow },
  { title: "Metas", url: "/comercial/metas", icon: Target },
  { title: "Dashboard Comercial", url: "/comercial/dashboard", icon: BarChart3 },
];

const marketing: Item[] = [
  { title: "Campanhas", url: "/marketing/campanhas", icon: Megaphone },
  { title: "Tráfego Pago", url: "/marketing/trafego", icon: MousePointerClick },
  { title: "Conteúdos", url: "/marketing/conteudos", icon: FileText },
  { title: "Dashboard Marketing", url: "/marketing/dashboard", icon: ChartPie },
];

const operacao: Item[] = [
  { title: "Financeiro", url: "/financeiro", icon: Wallet },
  { title: "Clientes", url: "/clientes", icon: Building2 },
  { title: "Automações", url: "/automacoes", icon: Workflow },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Estudos", url: "/estudos", icon: GraduationCap },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { data: perfil } = useProfile();
  const { pode, isAdmin } = usePermissao();

  const administracao: Item[] = [
    ...(pode("auditoria") ? [{ title: "Auditoria", url: "/auditoria", icon: ScrollText }] : []),
    ...(isAdmin
      ? [{ title: "Empresa e equipes", url: "/configuracoes/equipe", icon: ShieldCheck }]
      : []),
  ];

  const iniciais = (perfil?.nome ?? "Emerson Ferreira")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");


  const renderGroup = (label: string, items: Item[]) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel className="text-[0.68rem] uppercase tracking-[0.16em] text-sidebar-foreground/50">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate text-sm">{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-extrabold leading-tight text-sidebar-foreground">
                CRM Intelligence Hub
              </p>
              <p className="truncate text-[0.7rem] text-sidebar-foreground/60">
                CRM · Growth · BI · Automação
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {renderGroup("Visão geral", geral)}
        {renderGroup("Comercial", comercial)}
        {renderGroup("Marketing", marketing)}
        {renderGroup("Operação", operacao)}
        {administracao.length > 0 && renderGroup("Administração", administracao)}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Link
          to="/perfil"
          className="flex min-w-0 items-center gap-2.5 rounded-md p-1 transition-colors hover:bg-sidebar-accent"
        >
          <Avatar className="h-8 w-8 shrink-0">
            {perfil?.avatar_url && <AvatarImage src={perfil.avatar_url} alt={perfil.nome} />}
            <AvatarFallback className="bg-sidebar-primary/20 text-xs font-bold text-sidebar-primary-foreground">
              {iniciais}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-sidebar-foreground">
                {perfil?.nome ?? "Emerson Ferreira"}
              </p>
              <p className="truncate text-[0.68rem] text-sidebar-foreground/60">
                {perfil?.cargo ?? "Analista de Growth Marketing"}
              </p>
            </div>
          )}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
