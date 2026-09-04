import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  pergunta: z.string().min(2).max(1000),
  historico: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20)
    .optional(),
});

/**
 * Assistente IA: monta um snapshot analítico dos dados do CRM (via RLS do
 * usuário autenticado) e pergunta ao modelo do Lovable AI Gateway.
 */
export const perguntarAssistente = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("A IA ainda não está configurada neste ambiente.");

    const { supabase } = context;
    const [campanhas, vendas, oportunidades, clientes, leads, financeiro] = await Promise.all([
      supabase.from("campanhas").select("nome, canal, investimento, impressoes, cliques, leads_gerados, conversoes, receita"),
      supabase.from("vendas").select("cliente, produto, vendedor, valor, data_venda, dias_fechamento"),
      supabase.from("oportunidades").select("cliente, valor, probabilidade, responsavel, etapa, fechamento_previsto"),
      supabase.from("clientes").select("empresa, segmento, ltv, compras, risco_churn, ultimo_contato"),
      supabase.from("leads").select("nome, empresa, origem, campanha, score, responsavel, status"),
      supabase.from("financeiro_mensal").select("mes_ref, receita, meta, marketing, folha, despesas_operacionais, leads_gerados"),
    ]);

    const snapshot = {
      campanhas: campanhas.data ?? [],
      vendas: vendas.data ?? [],
      oportunidades: oportunidades.data ?? [],
      clientes: clientes.data ?? [],
      leads: leads.data ?? [],
      financeiro: financeiro.data ?? [],
    };

    const system = [
      "Você é o Assistente IA do CRM Intelligence Hub, especialista em CRM, Growth Marketing e Business Intelligence.",
      "Responda SEMPRE em português do Brasil, com objetividade executiva e números formatados em R$ e %.",
      "Use exclusivamente os dados do snapshot JSON fornecido. Calcule métricas quando necessário:",
      "CTR = cliques/impressões; CPC = investimento/cliques; CPM = investimento/(impressões/1000);",
      "CPL = investimento/leads; CPA = CAC = investimento/conversões; ROAS = receita/investimento;",
      "ROI = (receita-investimento)/investimento; Ticket médio = receita/nº de vendas;",
      "Lucro líquido = receita - (marketing + folha + despesas operacionais); Margem = lucro/receita.",
      "Se o dado não existir no snapshot, diga isso claramente em vez de inventar.",
      "Formate a resposta em markdown curto: uma conclusão direta e, quando útil, bullets com os números.",
    ].join(" ");

    const messages = [
      { role: "system", content: system },
      { role: "system", content: `Snapshot de dados (JSON): ${JSON.stringify(snapshot)}` },
      ...(data.historico ?? []),
      { role: "user", content: data.pergunta },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/gemini-3.5-flash", messages }),
    });

    if (!res.ok) {
      const detalhe = await res.text();
      if (res.status === 429) throw new Error("Limite de uso da IA atingido. Tente novamente em instantes.");
      throw new Error(`Falha na IA (${res.status}): ${detalhe.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { resposta: json.choices?.[0]?.message?.content ?? "Não consegui gerar uma resposta agora." };
  });
