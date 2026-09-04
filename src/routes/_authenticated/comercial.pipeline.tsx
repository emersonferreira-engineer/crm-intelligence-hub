import { createFileRoute } from "@tanstack/react-router";

import { OportunidadesView } from "@/components/oportunidades-view";

export const Route = createFileRoute("/_authenticated/comercial/pipeline")({
  head: () => ({
    meta: [
      { title: "Pipeline | CRM Intelligence Hub" },
      { name: "description", content: "Kanban do pipeline comercial do primeiro contato ao fechamento." },
      { property: "og:title", content: "Pipeline | CRM Intelligence Hub" },
      { property: "og:description", content: "Visual Kanban com etapas de qualificação, proposta e negociação." },
    ],
  }),
  component: () => <OportunidadesView defaultTab="kanban" />,
});
