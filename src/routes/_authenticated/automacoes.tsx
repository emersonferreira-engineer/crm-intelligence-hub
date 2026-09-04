import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bell, Bot, CheckCircle2, FileBarChart, Plug, Sparkles, Workflow } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, SectionCardTitle } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/automacoes")({
  head: () => ({
    meta: [
      { title: "Automações | CRM Intelligence Hub" },
      { name: "description", content: "Fluxos automatizados de qualificação de leads, follow-up e relatórios semanais." },
      { property: "og:title", content: "Automações | CRM Intelligence Hub" },
      { property: "og:description", content: "Estrutura pronta para n8n, Make, Zapier, Power Automate e APIs REST." },
    ],
  }),
  component: AutomacoesPage,
});

const fluxos = [
  {
    id: "AU-01",
    nome: "Novo lead criado",
    descricao: "Classificação automática por IA e criação de tarefa comercial.",
    gatilho: "Webhook: lead.created",
    icon: Bot,
    ativo: true,
    execucoes: 428,
    passos: ["Novo Lead", "Análise automática por IA", "Classificação do lead", "Criação de tarefa comercial"],
  },
  {
    id: "AU-02",
    nome: "Follow-up automático",
    descricao: "Lead sem contato por 3 dias gera alerta para o vendedor responsável.",
    gatilho: "Agendado: diário 08:00",
    icon: Bell,
    ativo: true,
    execucoes: 96,
    passos: ["Lead sem contato há 3 dias", "Verificação de responsável", "Alerta para o vendedor", "Registro de atividade"],
  },
  {
    id: "AU-03",
    nome: "Relatório semanal",
    descricao: "Resumo automático de novos leads, vendas e campanhas enviado à liderança.",
    gatilho: "Agendado: segunda 07:00",
    icon: FileBarChart,
    ativo: false,
    execucoes: 32,
    passos: ["Consolidar novos leads", "Consolidar vendas", "Consolidar campanhas", "Enviar resumo executivo"],
  },
];

const integracoes = [
  { nome: "n8n", status: "Pronto para conectar" },
  { nome: "Make", status: "Pronto para conectar" },
  { nome: "Zapier", status: "Pronto para conectar" },
  { nome: "Power Automate", status: "Pronto para conectar" },
  { nome: "APIs REST", status: "Endpoints previstos" },
];

function AutomacoesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Automações"
        description="Fluxos operacionais do CRM e estrutura de integração com plataformas externas"
        actions={
          <Button variant="outline" onClick={() => toast.info("Construtor de fluxos entra na próxima fase do roadmap.")}>
            <Workflow className="h-4 w-4" /> Novo fluxo
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {fluxos.map((f) => (
          <Card key={f.id} className="border-border/70 shadow-card">
            <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <f.icon className="h-4 w-4" />
              </div>
              <SectionCardTitle title={f.nome} subtitle={f.gatilho} />
              <Switch
                defaultChecked={f.ativo}
                onCheckedChange={(v) =>
                  toast.success(v ? `${f.nome} ativado` : `${f.nome} pausado`)
                }
              />
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{f.descricao}</p>
              <ol className="space-y-2">
                {f.passos.map((p, i) => (
                  <li key={p} className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-2">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0 text-xs font-medium">{p}</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-muted-foreground">{f.execucoes} execuções nos últimos 30 dias</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/70 shadow-card">
        <CardHeader>
          <SectionCardTitle
            title="Integrações preparadas"
            subtitle="Arquitetura com webhooks e endpoints REST para orquestradores externos"
          />
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {integracoes.map((i) => (
            <div key={i.nome} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <Plug className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold">{i.nome}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{i.status}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-success">
                <CheckCircle2 className="h-3 w-3" /> Estrutura pronta
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-card">
        <CardHeader>
          <SectionCardTitle title="Roadmap de inteligência" subtitle="Funcionalidades previstas na arquitetura" />
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {[
            "Chat com IA usando dados do CRM",
            "Previsão de vendas com machine learning",
            "Integração Google Ads API",
            "Integração Meta Ads API",
            "Integração WhatsApp Business",
            "Assistente comercial e recomendações de campanha",
          ].map((r) => (
            <div key={r} className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <p className="min-w-0 text-sm">{r}</p>
              <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
