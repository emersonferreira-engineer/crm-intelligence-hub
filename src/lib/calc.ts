// Motor de cálculos do CRM Intelligence Hub.
// Todas as métricas são derivadas — nada é fixo. Qualquer alteração nos dados
// de origem recalcula automaticamente os indicadores em tempo real.

const div = (a: number, b: number) => (b > 0 ? a / b : 0);
const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0);

export const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
    Number.isFinite(v) ? v : 0,
  );

export const formatBRLPreciso = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(
    Number.isFinite(v) ? v : 0,
  );

export const formatNum = (v: number, digits = 0) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits }).format(Number.isFinite(v) ? v : 0);

export const formatPct = (v: number, digits = 1) => `${formatNum(v, digits)}%`;

export const formatX = (v: number, digits = 2) => `${formatNum(v, digits)}x`;

export const mesCurto = (iso: string) => {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(d).replace(".", "");
};

export const dataCurta = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
};

/* ---------------------------------- Financeiro --------------------------------- */

export interface EntradaFinanceira {
  receita: number;
  marketing: number;
  folha: number;
  despesas_operacionais: number;
  meta?: number;
}

export interface ResultadoFinanceiro {
  receita: number;
  custoTotal: number;
  lucroBruto: number;
  lucroLiquido: number;
  margemBruta: number;
  margemLiquida: number;
  percentualDespesas: number;
  percentualMarketing: number;
  percentualFolha: number;
  fluxoCaixa: number;
  atingimentoMeta: number;
  resultado: "Lucro" | "Prejuízo" | "Equilíbrio";
}

export function calcularFinanceiro(e: EntradaFinanceira): ResultadoFinanceiro {
  const receita = e.receita || 0;
  const marketing = e.marketing || 0;
  const folha = e.folha || 0;
  const operacionais = e.despesas_operacionais || 0;
  const custoTotal = marketing + folha + operacionais;
  const lucroBruto = receita - operacionais;
  const lucroLiquido = receita - custoTotal;
  return {
    receita,
    custoTotal,
    lucroBruto,
    lucroLiquido,
    margemBruta: pct(lucroBruto, receita),
    margemLiquida: pct(lucroLiquido, receita),
    percentualDespesas: pct(custoTotal, receita),
    percentualMarketing: pct(marketing, receita),
    percentualFolha: pct(folha, receita),
    fluxoCaixa: lucroLiquido,
    atingimentoMeta: pct(receita, e.meta ?? 0),
    resultado: lucroLiquido > 0 ? "Lucro" : lucroLiquido < 0 ? "Prejuízo" : "Equilíbrio",
  };
}

/* ---------------------------------- Marketing --------------------------------- */

export interface EntradaCampanha {
  investimento: number;
  impressoes: number;
  cliques: number;
  leads_gerados: number;
  conversoes: number;
  receita: number;
}

export interface ResultadoCampanha {
  ctr: number;
  cpc: number;
  cpm: number;
  cpl: number;
  cpa: number;
  cac: number;
  custoPorConversao: number;
  taxaConversaoLead: number;
  taxaConversaoVenda: number;
  roas: number;
  roi: number;
  ticketMedio: number;
  lucro: number;
}

export function calcularCampanha(c: EntradaCampanha): ResultadoCampanha {
  const custoPorConversao = div(c.investimento, c.conversoes);
  return {
    ctr: pct(c.cliques, c.impressoes),
    cpc: div(c.investimento, c.cliques),
    cpm: div(c.investimento, c.impressoes / 1000),
    cpl: div(c.investimento, c.leads_gerados),
    cpa: custoPorConversao,
    cac: custoPorConversao,
    custoPorConversao,
    taxaConversaoLead: pct(c.leads_gerados, c.cliques),
    taxaConversaoVenda: pct(c.conversoes, c.leads_gerados),
    roas: div(c.receita, c.investimento),
    roi: pct(c.receita - c.investimento, c.investimento),
    ticketMedio: div(c.receita, c.conversoes),
    lucro: c.receita - c.investimento,
  };
}

export function somarCampanhas(lista: EntradaCampanha[]): EntradaCampanha {
  return lista.reduce<EntradaCampanha>(
    (acc, c) => ({
      investimento: acc.investimento + (c.investimento || 0),
      impressoes: acc.impressoes + (c.impressoes || 0),
      cliques: acc.cliques + (c.cliques || 0),
      leads_gerados: acc.leads_gerados + (c.leads_gerados || 0),
      conversoes: acc.conversoes + (c.conversoes || 0),
      receita: acc.receita + (c.receita || 0),
    }),
    { investimento: 0, impressoes: 0, cliques: 0, leads_gerados: 0, conversoes: 0, receita: 0 },
  );
}

/** Participação de cada item no total (share %). */
export function participacao<T>(lista: T[], valor: (item: T) => number) {
  const total = lista.reduce((s, i) => s + valor(i), 0);
  return lista.map((item) => ({ item, valor: valor(item), share: pct(valor(item), total) }));
}

/* ---------------------------------- Comercial --------------------------------- */

export interface EntradaVenda {
  valor: number;
  vendedor: string;
  data_venda: string;
  dias_fechamento: number;
}

export interface EntradaOportunidade {
  valor: number;
  probabilidade: number;
  etapa: string;
  responsavel: string;
}

export interface ResultadoComercial {
  receitaTotal: number;
  totalVendas: number;
  ticketMedio: number;
  pipelineTotal: number;
  pipelineAberto: number;
  forecastPonderado: number;
  cicloMedioDias: number;
  taxaConversaoPipeline: number;
}

export function calcularComercial(
  vendas: EntradaVenda[],
  oportunidades: EntradaOportunidade[],
): ResultadoComercial {
  const receitaTotal = vendas.reduce((s, v) => s + (v.valor || 0), 0);
  const abertas = oportunidades.filter((o) => o.etapa !== "Fechado" && o.etapa !== "Perdido");
  const fechadas = oportunidades.filter((o) => o.etapa === "Fechado");
  return {
    receitaTotal,
    totalVendas: vendas.length,
    ticketMedio: div(receitaTotal, vendas.length),
    pipelineTotal: oportunidades.reduce((s, o) => s + (o.valor || 0), 0),
    pipelineAberto: abertas.reduce((s, o) => s + (o.valor || 0), 0),
    forecastPonderado: abertas.reduce((s, o) => s + (o.valor || 0) * ((o.probabilidade || 0) / 100), 0),
    cicloMedioDias: div(
      vendas.reduce((s, v) => s + (v.dias_fechamento || 0), 0),
      vendas.length,
    ),
    taxaConversaoPipeline: pct(fechadas.length, oportunidades.length),
  };
}

export function agruparPor<T>(lista: T[], chave: (item: T) => string) {
  return lista.reduce<Record<string, T[]>>((acc, item) => {
    const k = chave(item) || "—";
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

export function receitaPorVendedor(vendas: EntradaVenda[]) {
  const grupos = agruparPor(vendas, (v) => v.vendedor);
  return Object.entries(grupos)
    .map(([vendedor, itens]) => {
      const receita = itens.reduce((s, v) => s + (v.valor || 0), 0);
      return {
        vendedor,
        receita,
        vendas: itens.length,
        ticketMedio: div(receita, itens.length),
        cicloDias: div(
          itens.reduce((s, v) => s + (v.dias_fechamento || 0), 0),
          itens.length,
        ),
      };
    })
    .sort((a, b) => b.receita - a.receita);
}

export function receitaPorMes(vendas: EntradaVenda[]) {
  const grupos = agruparPor(vendas, (v) => (v.data_venda ?? "").slice(0, 7));
  return Object.entries(grupos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, itens]) => ({
      mes,
      label: mesCurto(`${mes}-01`),
      receita: itens.reduce((s, v) => s + (v.valor || 0), 0),
      vendas: itens.length,
    }));
}

export { div, pct };
