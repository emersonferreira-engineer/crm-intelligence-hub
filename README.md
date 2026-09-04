# CRM INTELLIGENCE HUB

Crie uma aplicação web completa chamada "CRM Intelligence Hub".

O objetivo da aplicação é ser uma plataforma interna de CRM e Business Intelligence inspirada no Salesforce, combinando gestão comercial, análise de marketing, dashboards estilo Power BI, automações e uma área de estudos.

A aplicação deve ter design profissional, moderno e corporativo, com layout SaaS. Utilize uma interface limpa, responsiva e intuitiva.

Tecnologias desejadas:

- Frontend moderno

- Banco de dados integrado

- Autenticação de usuários

- Estrutura preparada para APIs e automações futuras

- Arquitetura escalável

A aplicação deve possuir menu lateral com as seguintes áreas:

1. DASHBOARD GERAL

Criar uma tela inicial executiva com visão geral da empresa.

Mostrar cards de indicadores:

COMERCIAL:

- Receita mensal

- Receita acumulada

- Meta x Realizado

- Número de oportunidades

- Taxa de conversão

- Ticket médio

- Forecast de vendas

MARKETING:

- Investimento em marketing

- Leads gerados

- CPL (Custo por Lead)

- CAC

- ROAS

- ROI

- Conversão por canal

Indicadores gerais:

- Clientes ativos

- Leads em andamento

- Crescimento mensal

- Churn

Criar gráficos:

- Evolução de receita

- Evolução de leads

- Conversão do funil

- Comparação Marketing x Comercial

2. MÓDULO COMERCIAL

Criar um CRM inspirado no Salesforce.

Submenus:

- Leads

- Contatos

- Empresas

- Oportunidades

- Pipeline

- Atividades

- Relatórios

- Dashboard Comercial

LEADS:

Criar uma tabela CRM com:

Campos:

- Nome

- Empresa

- Cargo

- Email

- Telefone

- Origem do lead

- Campanha

- Score do lead

- Responsável

- Status

- Data de criação

Status:

- Novo

- Contatado

- Qualificado

- Reunião marcada

- Proposta enviada

- Negociação

- Ganho

- Perdido

Adicionar:

- Busca

- Filtros

- Ordenação

- Cadastro de novos leads

OPORTUNIDADES:

Criar gestão de oportunidades comerciais.

Campos:

- Cliente

- Valor da oportunidade

- Probabilidade de fechamento

- Responsável

- Data prevista de fechamento

- Etapa do pipeline

Criar visual Kanban:

Colunas:

Novo Lead

↓

Qualificação

↓

Reunião

↓

Proposta

↓

Negociação

↓

Fechado

DASHBOARD COMERCIAL:

Criar painel estilo Power BI contendo:

Métricas:

- Receita total

- Receita por vendedor

- Meta x realizado

- Ticket médio

- Conversão por etapa

- Tempo médio de fechamento

- Motivos de perda

- Performance individual

3. MÓDULO MARKETING

Criar uma área específica para análise de marketing e tráfego pago.

Submenus:

- Campanhas

- Tráfego Pago

- Leads

- Conteúdos

- Dashboard Marketing

DASHBOARD MARKETING:

Criar indicadores:

Aquisição:

- Visitantes

- Sessões

- Leads

- Conversões

- CPL

- CPA

- CAC

Tráfego pago:

Criar tabela:

Campanha

Canal

Investimento

Impressões

Cliques

CTR

CPC

Leads

Conversões

Receita

ROAS

Criar gráficos:

- Investimento por canal

- Leads por campanha

- Conversão por canal

- ROI por campanha

Comparar:

Google Ads

Meta Ads

Orgânico

Email Marketing

4. MÓDULO CLIENTES

Criar cadastro completo de clientes.

Informações:

- Empresa

- Segmento

- Contatos

- Histórico de interações

- Compras

- Tickets

- Documentos

- Observações

Criar indicadores:

- Lifetime Value

- Frequência de compra

- Último contato

- Risco de churn

5. MÓDULO AUTOMAÇÕES

Criar uma área para demonstrar fluxos automatizados.

Criar exemplos:

AUTOMAÇÃO 1:

Novo lead criado

Fluxo:

Novo Lead →

Análise automática por IA →

Classificação do lead →

Criação de tarefa comercial

AUTOMAÇÃO 2:

Follow-up automático

Lead sem contato por 3 dias →

Criar alerta para vendedor

AUTOMAÇÃO 3:

Relatório semanal

Gerar resumo automático:

- Novos leads

- Vendas

- Campanhas

Preparar estrutura para integração com:

- n8n

- Make

- Zapier

- Power Automate

- APIs REST

6. MÓDULO ESTUDOS

Criar uma área chamada "Estudos".

Objetivo:

Ser uma universidade interna para capacitação dos usuários.

Criar categorias:

IA:

- ChatGPT

- Engenharia de Prompt

- IA Generativa

Marketing:

- Growth Marketing

- CRM

- Copywriting

Dados:

- Power BI

- Excel

- SQL

Automação:

- Make

- n8n

- APIs

Criar cards de cursos:

Cada curso deve possuir:

- Nome

- Descrição

- Categoria

- Link do curso

- Link do vídeo

- Material complementar

- Status:

  - Não iniciado

  - Em andamento

  - Concluído

Adicionar:

- Barra de progresso

- Favoritos

- Busca

7. ÁREA DE RELATÓRIOS

Criar relatórios exportáveis.

Relatórios:

Comercial:

- Pipeline

- Vendas

- Conversão

Marketing:

- Campanhas

- Tráfego

- ROI

Clientes:

- Retenção

- LTV

8. BANCO DE DADOS

Criar estrutura preparada para:

Tabela usuários:

- Nome

- Email

- Cargo

- Permissão

Tabela leads:

- Nome

- Empresa

- Email

- Telefone

- Origem

- Status

- Score

- Responsável

Tabela oportunidades:

- Cliente

- Valor

- Etapa

- Probabilidade

Tabela campanhas:

- Nome

- Canal

- Investimento

- Leads

- Conversões

- Receita

Tabela clientes:

- Empresa

- Segmento

- Histórico

- Valor total

Tabela cursos:

- Nome

- Categoria

- Link

- Progresso

9. DESIGN

Criar aparência semelhante a ferramentas profissionais:

Referências:

- Salesforce

- HubSpot

- Power BI

- Monday.com

Características:

- Menu lateral

- Cards de KPI

- Gráficos profissionais

- Tabelas interativas

- Dashboard executivo

- Responsivo para desktop

10. FUNCIONALIDADES FUTURAS

Preparar arquitetura para adicionar:

- Chat com IA usando os dados do CRM

- Previsão de vendas com inteligência artificial

- Integração Google Ads API

- Integração Meta Ads API

- Integração WhatsApp

- Assistente comercial com IA

- Recomendações automáticas de campanhas

Crie inicialmente a versão MVP funcional com dados fictícios para demonstração, incluindo exemplos de leads, clientes, campanhas e métricas para que o sistema pareça uma ferramenta real de uma empresa.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c8431a8f-bce3-49fb-b4ed-e8674fab7d42).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
