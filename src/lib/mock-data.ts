// Dados fictícios de demonstração do CRM Intelligence Hub.
// Substituíveis por queries reais quando o banco de dados for conectado.

export type LeadStatus =
  | "Novo"
  | "Contatado"
  | "Qualificado"
  | "Reunião marcada"
  | "Proposta enviada"
  | "Negociação"
  | "Ganho"
  | "Perdido";

export interface Lead {
  id: string;
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  origem: string;
  campanha: string;
  score: number;
  responsavel: string;
  status: LeadStatus;
  criadoEm: string;
}

export const leadStatuses: LeadStatus[] = [
  "Novo",
  "Contatado",
  "Qualificado",
  "Reunião marcada",
  "Proposta enviada",
  "Negociação",
  "Ganho",
  "Perdido",
];

export const origens = ["Google Ads", "Meta Ads", "Orgânico", "Email Marketing", "Indicação", "Evento"];
export const responsaveis = ["Ana Ribeiro", "Bruno Tavares", "Camila Duarte", "Diego Moraes", "Elisa Nunes"];

export const leads: Lead[] = [
  { id: "LD-1001", nome: "Marcos Ferreira", empresa: "Nordex Logística", cargo: "Diretor de Operações", email: "marcos@nordex.com.br", telefone: "+55 11 98812-4410", origem: "Google Ads", campanha: "Search | CRM B2B", score: 88, responsavel: "Ana Ribeiro", status: "Negociação", criadoEm: "2026-07-14" },
  { id: "LD-1002", nome: "Juliana Prado", empresa: "Vitalis Saúde", cargo: "Head de Marketing", email: "juliana@vitalis.com", telefone: "+55 21 99120-7781", origem: "Meta Ads", campanha: "Remarketing | Demo", score: 74, responsavel: "Bruno Tavares", status: "Proposta enviada", criadoEm: "2026-07-19" },
  { id: "LD-1003", nome: "Rafael Andrade", empresa: "Construtora Ápice", cargo: "CFO", email: "rafael@apice.eng.br", telefone: "+55 31 98771-2210", origem: "Indicação", campanha: "Programa Parceiros", score: 91, responsavel: "Camila Duarte", status: "Reunião marcada", criadoEm: "2026-07-22" },
  { id: "LD-1004", nome: "Patrícia Lopes", empresa: "Grupo Sereno", cargo: "Gerente Comercial", email: "patricia@sereno.com.br", telefone: "+55 41 99005-3312", origem: "Orgânico", campanha: "Blog | Pipeline", score: 62, responsavel: "Diego Moraes", status: "Contatado", criadoEm: "2026-07-25" },
  { id: "LD-1005", nome: "Henrique Costa", empresa: "Agromax", cargo: "CEO", email: "henrique@agromax.agr.br", telefone: "+55 62 98410-9922", origem: "Evento", campanha: "Feira AgroTech", score: 79, responsavel: "Elisa Nunes", status: "Qualificado", criadoEm: "2026-07-27" },
  { id: "LD-1006", nome: "Fernanda Alves", empresa: "TechNova", cargo: "COO", email: "fernanda@technova.io", telefone: "+55 11 97744-1200", origem: "Google Ads", campanha: "Search | BI", score: 84, responsavel: "Ana Ribeiro", status: "Novo", criadoEm: "2026-08-01" },
  { id: "LD-1007", nome: "Leonardo Dias", empresa: "Banco Cordial", cargo: "Head de Dados", email: "leonardo@cordial.com", telefone: "+55 11 96633-8890", origem: "Email Marketing", campanha: "Nurture | Dados", score: 70, responsavel: "Bruno Tavares", status: "Contatado", criadoEm: "2026-08-02" },
  { id: "LD-1008", nome: "Simone Barros", empresa: "Rede Bela", cargo: "Diretora de Vendas", email: "simone@redebela.com", telefone: "+55 85 98122-4455", origem: "Meta Ads", campanha: "Lookalike | Varejo", score: 58, responsavel: "Camila Duarte", status: "Perdido", criadoEm: "2026-06-30" },
  { id: "LD-1009", nome: "Otávio Menezes", empresa: "LogTrans", cargo: "Gerente de TI", email: "otavio@logtrans.com.br", telefone: "+55 51 99887-1122", origem: "Orgânico", campanha: "SEO | Automação", score: 66, responsavel: "Diego Moraes", status: "Qualificado", criadoEm: "2026-08-03" },
  { id: "LD-1010", nome: "Bianca Rocha", empresa: "Studio Clara", cargo: "Sócia", email: "bianca@studioclara.com", telefone: "+55 11 98001-7766", origem: "Indicação", campanha: "Programa Parceiros", score: 95, responsavel: "Elisa Nunes", status: "Ganho", criadoEm: "2026-06-18" },
  { id: "LD-1011", nome: "Gustavo Pinho", empresa: "Farmatec", cargo: "Diretor Comercial", email: "gustavo@farmatec.com", telefone: "+55 19 99432-8890", origem: "Google Ads", campanha: "Search | CRM B2B", score: 81, responsavel: "Ana Ribeiro", status: "Reunião marcada", criadoEm: "2026-08-04" },
  { id: "LD-1012", nome: "Larissa Neves", empresa: "EducaMais", cargo: "Coordenadora", email: "larissa@educamais.org", telefone: "+55 71 98333-2211", origem: "Email Marketing", campanha: "Webinar | CRM", score: 55, responsavel: "Bruno Tavares", status: "Novo", criadoEm: "2026-08-05" },
];

export type Etapa = "Novo Lead" | "Qualificação" | "Reunião" | "Proposta" | "Negociação" | "Fechado";
export const etapas: Etapa[] = ["Novo Lead", "Qualificação", "Reunião", "Proposta", "Negociação", "Fechado"];

export interface Oportunidade {
  id: string;
  cliente: string;
  valor: number;
  probabilidade: number;
  responsavel: string;
  fechamentoPrevisto: string;
  etapa: Etapa;
}

export const oportunidades: Oportunidade[] = [
  { id: "OP-2001", cliente: "Nordex Logística", valor: 184000, probabilidade: 70, responsavel: "Ana Ribeiro", fechamentoPrevisto: "2026-08-28", etapa: "Negociação" },
  { id: "OP-2002", cliente: "Vitalis Saúde", valor: 96500, probabilidade: 55, responsavel: "Bruno Tavares", fechamentoPrevisto: "2026-09-05", etapa: "Proposta" },
  { id: "OP-2003", cliente: "Construtora Ápice", valor: 240000, probabilidade: 45, responsavel: "Camila Duarte", fechamentoPrevisto: "2026-09-18", etapa: "Reunião" },
  { id: "OP-2004", cliente: "Grupo Sereno", valor: 58000, probabilidade: 25, responsavel: "Diego Moraes", fechamentoPrevisto: "2026-09-30", etapa: "Qualificação" },
  { id: "OP-2005", cliente: "Agromax", valor: 132000, probabilidade: 40, responsavel: "Elisa Nunes", fechamentoPrevisto: "2026-10-02", etapa: "Qualificação" },
  { id: "OP-2006", cliente: "TechNova", valor: 75000, probabilidade: 15, responsavel: "Ana Ribeiro", fechamentoPrevisto: "2026-10-14", etapa: "Novo Lead" },
  { id: "OP-2007", cliente: "Banco Cordial", valor: 320000, probabilidade: 60, responsavel: "Bruno Tavares", fechamentoPrevisto: "2026-09-11", etapa: "Proposta" },
  { id: "OP-2008", cliente: "Studio Clara", valor: 42000, probabilidade: 100, responsavel: "Elisa Nunes", fechamentoPrevisto: "2026-07-30", etapa: "Fechado" },
  { id: "OP-2009", cliente: "Farmatec", valor: 158000, probabilidade: 50, responsavel: "Ana Ribeiro", fechamentoPrevisto: "2026-09-22", etapa: "Reunião" },
  { id: "OP-2010", cliente: "LogTrans", valor: 88000, probabilidade: 35, responsavel: "Diego Moraes", fechamentoPrevisto: "2026-10-08", etapa: "Novo Lead" },
  { id: "OP-2011", cliente: "Rede Bela", valor: 64000, probabilidade: 80, responsavel: "Camila Duarte", fechamentoPrevisto: "2026-08-25", etapa: "Negociação" },
  { id: "OP-2012", cliente: "EducaMais", valor: 36000, probabilidade: 100, responsavel: "Bruno Tavares", fechamentoPrevisto: "2026-07-24", etapa: "Fechado" },
];

export interface Campanha {
  id: string;
  nome: string;
  canal: "Google Ads" | "Meta Ads" | "Orgânico" | "Email Marketing";
  investimento: number;
  impressoes: number;
  cliques: number;
  leads: number;
  conversoes: number;
  receita: number;
}

export const campanhas: Campanha[] = [
  { id: "CP-01", nome: "Search | CRM B2B", canal: "Google Ads", investimento: 42000, impressoes: 812000, cliques: 24300, leads: 480, conversoes: 62, receita: 486000 },
  { id: "CP-02", nome: "Search | BI", canal: "Google Ads", investimento: 28500, impressoes: 512000, cliques: 15800, leads: 310, conversoes: 38, receita: 298000 },
  { id: "CP-03", nome: "Remarketing | Demo", canal: "Meta Ads", investimento: 19800, impressoes: 1240000, cliques: 21400, leads: 372, conversoes: 41, receita: 262000 },
  { id: "CP-04", nome: "Lookalike | Varejo", canal: "Meta Ads", investimento: 16400, impressoes: 980000, cliques: 14200, leads: 244, conversoes: 21, receita: 132000 },
  { id: "CP-05", nome: "Nurture | Dados", canal: "Email Marketing", investimento: 6200, impressoes: 210000, cliques: 9800, leads: 198, conversoes: 27, receita: 168000 },
  { id: "CP-06", nome: "Webinar | CRM", canal: "Email Marketing", investimento: 8100, impressoes: 164000, cliques: 7400, leads: 156, conversoes: 19, receita: 121000 },
  { id: "CP-07", nome: "SEO | Automação", canal: "Orgânico", investimento: 12000, impressoes: 640000, cliques: 33800, leads: 402, conversoes: 48, receita: 352000 },
  { id: "CP-08", nome: "Blog | Pipeline", canal: "Orgânico", investimento: 9400, impressoes: 428000, cliques: 22100, leads: 268, conversoes: 30, receita: 214000 },
];

export interface Cliente {
  id: string;
  empresa: string;
  segmento: string;
  contatoPrincipal: string;
  email: string;
  ltv: number;
  compras: number;
  frequenciaCompraMeses: number;
  ultimoContato: string;
  riscoChurn: "Baixo" | "Médio" | "Alto";
  tickets: number;
  documentos: number;
  observacoes: string;
  historico: { data: string; tipo: string; descricao: string }[];
}

export const clientes: Cliente[] = [
  {
    id: "CL-01", empresa: "Studio Clara", segmento: "Serviços criativos", contatoPrincipal: "Bianca Rocha", email: "bianca@studioclara.com",
    ltv: 268000, compras: 7, frequenciaCompraMeses: 4, ultimoContato: "2026-08-03", riscoChurn: "Baixo", tickets: 2, documentos: 5,
    observacoes: "Cliente promotor, indicou 3 novas contas em 2026.",
    historico: [
      { data: "2026-08-03", tipo: "Reunião", descricao: "Revisão trimestral de resultados" },
      { data: "2026-06-18", tipo: "Contrato", descricao: "Upgrade para plano Enterprise" },
    ],
  },
  {
    id: "CL-02", empresa: "Nordex Logística", segmento: "Logística", contatoPrincipal: "Marcos Ferreira", email: "marcos@nordex.com.br",
    ltv: 512000, compras: 11, frequenciaCompraMeses: 3, ultimoContato: "2026-07-29", riscoChurn: "Médio", tickets: 6, documentos: 12,
    observacoes: "Solicitou integração com WhatsApp para time de campo.",
    historico: [
      { data: "2026-07-29", tipo: "Suporte", descricao: "Ticket de integração de API resolvido" },
      { data: "2026-05-12", tipo: "Compra", descricao: "20 licenças adicionais" },
    ],
  },
  {
    id: "CL-03", empresa: "Banco Cordial", segmento: "Financeiro", contatoPrincipal: "Leonardo Dias", email: "leonardo@cordial.com",
    ltv: 890000, compras: 14, frequenciaCompraMeses: 2, ultimoContato: "2026-08-05", riscoChurn: "Baixo", tickets: 3, documentos: 21,
    observacoes: "Compliance exige relatórios trimestrais de segurança.",
    historico: [
      { data: "2026-08-05", tipo: "Reunião", descricao: "Roadmap de BI para 2027" },
      { data: "2026-07-02", tipo: "Compra", descricao: "Módulo de forecasting" },
    ],
  },
  {
    id: "CL-04", empresa: "Rede Bela", segmento: "Varejo", contatoPrincipal: "Simone Barros", email: "simone@redebela.com",
    ltv: 143000, compras: 4, frequenciaCompraMeses: 8, ultimoContato: "2026-06-11", riscoChurn: "Alto", tickets: 9, documentos: 4,
    observacoes: "Baixa adoção do módulo comercial; risco de não renovação.",
    historico: [
      { data: "2026-06-11", tipo: "Suporte", descricao: "Reclamação sobre importação de dados" },
      { data: "2026-03-20", tipo: "Compra", descricao: "Renovação anual" },
    ],
  },
  {
    id: "CL-05", empresa: "EducaMais", segmento: "Educação", contatoPrincipal: "Larissa Neves", email: "larissa@educamais.org",
    ltv: 96000, compras: 3, frequenciaCompraMeses: 6, ultimoContato: "2026-07-24", riscoChurn: "Médio", tickets: 1, documentos: 3,
    observacoes: "Interessada na área de Estudos para capacitação interna.",
    historico: [
      { data: "2026-07-24", tipo: "Compra", descricao: "Contratação inicial (36 mil)" },
      { data: "2026-07-10", tipo: "Demo", descricao: "Apresentação de dashboards" },
    ],
  },
];

export const receitaMensal = [
  { mes: "Jan", receita: 412000, meta: 420000, leads: 620, investimento: 74000 },
  { mes: "Fev", receita: 448000, meta: 430000, leads: 668, investimento: 78000 },
  { mes: "Mar", receita: 501000, meta: 470000, leads: 712, investimento: 84000 },
  { mes: "Abr", receita: 478000, meta: 490000, leads: 690, investimento: 88000 },
  { mes: "Mai", receita: 552000, meta: 510000, leads: 764, investimento: 92000 },
  { mes: "Jun", receita: 596000, meta: 540000, leads: 812, investimento: 98000 },
  { mes: "Jul", receita: 641000, meta: 580000, leads: 884, investimento: 104000 },
  { mes: "Ago", receita: 358000, meta: 610000, leads: 402, investimento: 56000 },
];

export const funil = [
  { etapa: "Leads", valor: 4820 },
  { etapa: "Qualificados", valor: 1980 },
  { etapa: "Reuniões", valor: 862 },
  { etapa: "Propostas", valor: 431 },
  { etapa: "Negociação", valor: 248 },
  { etapa: "Fechados", valor: 142 },
];

export const canaisConversao = [
  { canal: "Google Ads", leads: 790, conversao: 12.7, investimento: 70500, receita: 784000 },
  { canal: "Meta Ads", leads: 616, conversao: 10.1, investimento: 36200, receita: 394000 },
  { canal: "Orgânico", leads: 670, conversao: 11.6, investimento: 21400, receita: 566000 },
  { canal: "Email Marketing", leads: 354, conversao: 13.0, investimento: 14300, receita: 289000 },
];

export const receitaPorVendedor = [
  { vendedor: "Ana Ribeiro", receita: 1284000, meta: 1200000, ganhos: 34, cicloDias: 38 },
  { vendedor: "Bruno Tavares", receita: 1042000, meta: 1100000, ganhos: 28, cicloDias: 44 },
  { vendedor: "Camila Duarte", receita: 968000, meta: 950000, ganhos: 26, cicloDias: 41 },
  { vendedor: "Diego Moraes", receita: 724000, meta: 850000, ganhos: 19, cicloDias: 52 },
  { vendedor: "Elisa Nunes", receita: 858000, meta: 800000, ganhos: 23, cicloDias: 36 },
];

export const motivosPerda = [
  { motivo: "Preço", valor: 38 },
  { motivo: "Sem budget", valor: 24 },
  { motivo: "Concorrente", valor: 19 },
  { motivo: "Timing", valor: 12 },
  { motivo: "Sem fit", valor: 7 },
];

export const conteudos = [
  { titulo: "Guia definitivo de CRM B2B", tipo: "E-book", canal: "Orgânico", visualizacoes: 18400, leads: 268, conversao: 1.5 },
  { titulo: "Webinar: forecast com IA", tipo: "Webinar", canal: "Email Marketing", visualizacoes: 6200, leads: 156, conversao: 2.5 },
  { titulo: "Checklist de automação comercial", tipo: "Checklist", canal: "Meta Ads", visualizacoes: 11800, leads: 194, conversao: 1.6 },
  { titulo: "Case: 3x pipeline em 6 meses", tipo: "Case", canal: "Google Ads", visualizacoes: 9400, leads: 212, conversao: 2.3 },
];

export type CursoStatus = "Não iniciado" | "Em andamento" | "Concluído";

export interface Curso {
  id: string;
  nome: string;
  descricao: string;
  categoria: "IA" | "Marketing" | "Dados" | "Automação";
  trilha: string;
  linkCurso: string;
  linkVideo: string;
  material: string;
  status: CursoStatus;
  progresso: number;
  favorito: boolean;
}

export const cursos: Curso[] = [
  { id: "CS-01", nome: "ChatGPT para times comerciais", descricao: "Use IA generativa para acelerar prospecção, follow-ups e propostas.", categoria: "IA", trilha: "ChatGPT", linkCurso: "https://learn.microsoft.com/", linkVideo: "https://www.youtube.com/results?search_query=chatgpt+vendas", material: "Playbook de prompts comerciais", status: "Em andamento", progresso: 62, favorito: true },
  { id: "CS-02", nome: "Engenharia de Prompt aplicada", descricao: "Estruture prompts confiáveis para análise de dados e classificação de leads.", categoria: "IA", trilha: "Engenharia de Prompt", linkCurso: "https://www.promptingguide.ai/", linkVideo: "https://www.youtube.com/results?search_query=prompt+engineering", material: "Biblioteca de templates", status: "Não iniciado", progresso: 0, favorito: false },
  { id: "CS-03", nome: "IA Generativa para conteúdo", descricao: "Produção de conteúdo em escala com governança de marca.", categoria: "IA", trilha: "IA Generativa", linkCurso: "https://www.deeplearning.ai/", linkVideo: "https://www.youtube.com/results?search_query=generative+ai+marketing", material: "Guia de brand voice", status: "Não iniciado", progresso: 0, favorito: false },
  { id: "CS-04", nome: "Growth Marketing na prática", descricao: "Experimentação, canais de aquisição e loops de crescimento.", categoria: "Marketing", trilha: "Growth Marketing", linkCurso: "https://www.reforge.com/", linkVideo: "https://www.youtube.com/results?search_query=growth+marketing", material: "Planilha de experimentos", status: "Concluído", progresso: 100, favorito: true },
  { id: "CS-05", nome: "CRM: operação e higiene de dados", descricao: "Padrões de cadastro, SLA de follow-up e governança do pipeline.", categoria: "Marketing", trilha: "CRM", linkCurso: "https://trailhead.salesforce.com/", linkVideo: "https://www.youtube.com/results?search_query=crm+best+practices", material: "Manual de operação CRM", status: "Em andamento", progresso: 45, favorito: false },
  { id: "CS-06", nome: "Copywriting para conversão", descricao: "Estruturas de copy para anúncios, landing pages e e-mails.", categoria: "Marketing", trilha: "Copywriting", linkCurso: "https://copyblogger.com/", linkVideo: "https://www.youtube.com/results?search_query=copywriting+conversao", material: "Swipe file interno", status: "Não iniciado", progresso: 0, favorito: false },
  { id: "CS-07", nome: "Power BI do zero ao dashboard", descricao: "Modelagem, DAX essencial e publicação de relatórios executivos.", categoria: "Dados", trilha: "Power BI", linkCurso: "https://learn.microsoft.com/power-bi/", linkVideo: "https://www.youtube.com/results?search_query=power+bi+curso", material: "Arquivos .pbix de exemplo", status: "Em andamento", progresso: 78, favorito: true },
  { id: "CS-08", nome: "Excel avançado para análise", descricao: "Tabelas dinâmicas, Power Query e modelos financeiros.", categoria: "Dados", trilha: "Excel", linkCurso: "https://support.microsoft.com/excel", linkVideo: "https://www.youtube.com/results?search_query=excel+avancado", material: "Pasta de trabalho modelo", status: "Concluído", progresso: 100, favorito: false },
  { id: "CS-09", nome: "SQL para times de negócio", descricao: "Consultas, joins e agregações para análises self-service.", categoria: "Dados", trilha: "SQL", linkCurso: "https://sqlbolt.com/", linkVideo: "https://www.youtube.com/results?search_query=sql+para+negocios", material: "Lista de queries do CRM", status: "Em andamento", progresso: 30, favorito: false },
  { id: "CS-10", nome: "Make: automações sem código", descricao: "Cenários, roteadores e tratamento de erros no Make.", categoria: "Automação", trilha: "Make", linkCurso: "https://www.make.com/en/academy", linkVideo: "https://www.youtube.com/results?search_query=make+automation", material: "Blueprints prontos", status: "Não iniciado", progresso: 0, favorito: false },
  { id: "CS-11", nome: "n8n avançado", descricao: "Workflows self-hosted, webhooks e integrações com IA.", categoria: "Automação", trilha: "n8n", linkCurso: "https://docs.n8n.io/", linkVideo: "https://www.youtube.com/results?search_query=n8n+workflow", material: "Workflows JSON", status: "Em andamento", progresso: 55, favorito: true },
  { id: "CS-12", nome: "APIs REST para não-devs", descricao: "Autenticação, endpoints e testes com Postman.", categoria: "Automação", trilha: "APIs", linkCurso: "https://learning.postman.com/", linkVideo: "https://www.youtube.com/results?search_query=api+rest+basico", material: "Collection Postman do CRM", status: "Não iniciado", progresso: 0, favorito: false },
];

export const atividades = [
  { id: "AT-01", tipo: "Ligação", assunto: "Follow-up proposta Nordex", relacionado: "Nordex Logística", responsavel: "Ana Ribeiro", vencimento: "2026-08-07", status: "Pendente" },
  { id: "AT-02", tipo: "Reunião", assunto: "Discovery Construtora Ápice", relacionado: "Construtora Ápice", responsavel: "Camila Duarte", vencimento: "2026-08-08", status: "Agendada" },
  { id: "AT-03", tipo: "Email", assunto: "Envio de business case", relacionado: "Banco Cordial", responsavel: "Bruno Tavares", vencimento: "2026-08-07", status: "Pendente" },
  { id: "AT-04", tipo: "Tarefa", assunto: "Atualizar score de leads da semana", relacionado: "Marketing", responsavel: "Diego Moraes", vencimento: "2026-08-09", status: "Pendente" },
  { id: "AT-05", tipo: "Ligação", assunto: "Retenção Rede Bela", relacionado: "Rede Bela", responsavel: "Camila Duarte", vencimento: "2026-08-06", status: "Atrasada" },
];

export const kpisGerais = {
  receitaMensal: 641000,
  receitaAcumulada: 3986000,
  meta: 580000,
  oportunidades: oportunidades.length,
  taxaConversao: 12.4,
  ticketMedio: 118400,
  forecast: 742000,
  investimentoMarketing: 142400,
  leadsGerados: 2430,
  cpl: 58.6,
  cac: 1284,
  roas: 4.8,
  roi: 312,
  clientesAtivos: 148,
  leadsAndamento: 386,
  crescimentoMensal: 7.6,
  churn: 2.1,
};

export const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

export const formatNum = (v: number) => new Intl.NumberFormat("pt-BR").format(v);
