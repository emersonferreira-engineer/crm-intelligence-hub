import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { perguntarAssistente } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/assistente-ia")({
  head: () => ({
    meta: [
      { title: "Assistente IA | CRM Intelligence Hub" },
      {
        name: "description",
        content:
          "Pergunte em linguagem natural sobre ROI, CAC, churn, vendedores e campanhas — a IA responde com base nos dados do CRM.",
      },
      { property: "og:title", content: "Assistente IA | CRM Intelligence Hub" },
      {
        property: "og:description",
        content: "Análises automáticas de marketing, vendas e carteira de clientes com inteligência artificial.",
      },
    ],
  }),
  component: AssistenteIA,
});

const sugestoes = [
  "Qual campanha teve melhor ROI?",
  "Qual vendedor converte mais?",
  "Quanto investi este mês?",
  "Qual meu CAC?",
  "Qual campanha gerou mais receita?",
  "Qual cliente está em risco de churn?",
];

type Mensagem = { role: "user" | "assistant"; content: string };

function Markdown({ texto }: { texto: string }) {
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {texto.split("\n").map((linha, i) => {
        const limpa = linha.replace(/\*\*(.+?)\*\*/g, "$1");
        if (!limpa.trim()) return null;
        if (/^[-*]\s/.test(limpa.trim()))
          return (
            <p key={i} className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{limpa.trim().replace(/^[-*]\s/, "")}</span>
            </p>
          );
        if (/^#{1,3}\s/.test(limpa.trim()))
          return (
            <p key={i} className="font-display text-sm font-extrabold">
              {limpa.replace(/^#{1,3}\s/, "")}
            </p>
          );
        return <p key={i}>{limpa}</p>;
      })}
    </div>
  );
}

function AssistenteIA() {
  const perguntar = useServerFn(perguntarAssistente);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const fim = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: async (pergunta: string) => {
      const historico = mensagens.slice(-8);
      return perguntar({ data: { pergunta, historico } });
    },
    onSuccess: (res) => {
      setMensagens((prev) => [...prev, { role: "assistant", content: res.resposta }]);
      requestAnimationFrame(() => fim.current?.scrollIntoView({ behavior: "smooth" }));
    },
    onError: (e: Error) => {
      setMensagens((prev) => [...prev, { role: "assistant", content: `⚠️ ${e.message}` }]);
    },
  });

  const enviar = (pergunta: string) => {
    const limpa = pergunta.trim();
    if (!limpa || mutation.isPending) return;
    setMensagens((prev) => [...prev, { role: "user", content: limpa }]);
    setTexto("");
    mutation.mutate(limpa);
    requestAnimationFrame(() => fim.current?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Assistente IA"
        description="Perguntas em linguagem natural sobre receita, campanhas, pipeline e carteira — respondidas com os dados reais do CRM."
      />

      <Card className="flex min-h-[26rem] flex-col gap-0 overflow-hidden border-border/70 p-0 shadow-card">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {mensagens.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </span>
              <div className="space-y-1">
                <p className="font-display text-base font-extrabold">Como posso ajudar na sua análise?</p>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  Pergunte sobre ROI, CAC, CPL, ROAS, forecast, performance por vendedor ou risco de churn.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {sugestoes.map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => enviar(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {mensagens.map((m, i) => (
            <div
              key={i}
              className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse text-right" : "flex-row")}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                  m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary",
                )}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div
                className={cn(
                  "max-w-[85%] rounded-xl border border-border/70 px-3 py-2 text-left",
                  m.role === "user" ? "bg-secondary/50" : "bg-card",
                )}
              >
                <Markdown texto={m.content} />
              </div>
            </div>
          ))}

          {mutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Analisando os dados do CRM...
            </div>
          )}
          <div ref={fim} />
        </div>

        <form
          className="flex items-center gap-2 border-t border-border bg-card/60 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            enviar(texto);
          }}
        >
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ex.: qual campanha teve o melhor ROAS neste ano?"
            disabled={mutation.isPending}
          />
          <Button type="submit" disabled={mutation.isPending || !texto.trim()} className="gap-2">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Enviar</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
