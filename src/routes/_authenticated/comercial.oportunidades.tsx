import { createFileRoute } from "@tanstack/react-router";

import { OportunidadesView } from "@/components/oportunidades-view";

export const Route = createFileRoute("/_authenticated/comercial/oportunidades")({
  head: () => ({
    meta: [
      { title: "Oportunidades | CRM Intelligence Hub" },
      { name: "description", content: "Gestão de oportunidades comerciais com valor, probabilidade e etapa." },
      { property: "og:title", content: "Oportunidades | CRM Intelligence Hub" },
      { property: "og:description", content: "Valor em pipeline, probabilidade e previsão de fechamento." },
    ],
  }),
  component: () => <OportunidadesView defaultTab="tabela" />,
});
