import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ExternalLink, FileDown, PlayCircle, Search, Star } from "lucide-react";

import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cursos as seed, type Curso } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/estudos")({
  head: () => ({
    meta: [
      { title: "Estudos | CRM Intelligence Hub" },
      { name: "description", content: "Universidade interna: trilhas de IA, marketing, dados e automação com progresso." },
      { property: "og:title", content: "Estudos | CRM Intelligence Hub" },
      { property: "og:description", content: "Capacitação do time com cursos, vídeos e materiais complementares." },
    ],
  }),
  component: EstudosPage,
});

const categorias = ["IA", "Marketing", "Dados", "Automação"] as const;
const statusList = ["Não iniciado", "Em andamento", "Concluído"] as const;

const statusClass: Record<string, string> = {
  "Não iniciado": "bg-muted text-muted-foreground",
  "Em andamento": "bg-primary/10 text-primary",
  Concluído: "bg-success/12 text-success",
};

function EstudosPage() {
  const [rows, setRows] = useState<Curso[]>(seed);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("todas");
  const [status, setStatus] = useState("todos");
  const [soFavoritos, setSoFavoritos] = useState(false);

  const filtrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(
      (c) =>
        (!term || [c.nome, c.descricao, c.trilha].some((f) => f.toLowerCase().includes(term))) &&
        (cat === "todas" || c.categoria === cat) &&
        (status === "todos" || c.status === status) &&
        (!soFavoritos || c.favorito),
    );
  }, [rows, q, cat, status, soFavoritos]);

  const progressoGeral = Math.round(rows.reduce((s, c) => s + c.progresso, 0) / rows.length);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Estudos"
        description="Universidade interna para capacitação contínua do time"
        actions={
          <Button variant={soFavoritos ? "default" : "outline"} onClick={() => setSoFavoritos((v) => !v)}>
            <Star className="h-4 w-4" /> Favoritos
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cursos disponíveis" value={String(rows.length)} icon={<BookOpen className="h-4 w-4" />} />
        <KpiCard label="Em andamento" value={String(rows.filter((c) => c.status === "Em andamento").length)} icon={<PlayCircle className="h-4 w-4" />} />
        <KpiCard label="Concluídos" value={String(rows.filter((c) => c.status === "Concluído").length)} tone="success" icon={<BookOpen className="h-4 w-4" />} />
        <Card className="gap-2 border-border/70 p-4 shadow-card">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Progresso geral
          </p>
          <p className="font-display text-2xl font-extrabold tabular-nums">{progressoGeral}%</p>
          <Progress value={progressoGeral} className="h-2" />
        </Card>
      </div>

      <Card className="border-border/70 shadow-card">
        <CardContent className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,180px)_minmax(0,180px)]">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar curso ou trilha" className="pl-9" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {statusList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtrados.map((c) => (
          <Card key={c.id} className="gap-3 border-border/70 p-4 shadow-card transition-shadow hover:shadow-lg">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[0.7rem] font-bold text-primary">
                  {c.categoria} · {c.trilha}
                </span>
                <h3 className="mt-2 text-sm font-bold">{c.nome}</h3>
              </div>
              <button
                aria-label="Favoritar curso"
                onClick={() =>
                  setRows((r) => r.map((x) => (x.id === c.id ? { ...x, favorito: !x.favorito } : x)))
                }
                className="shrink-0 rounded-md p-1 hover:bg-muted"
              >
                <Star className={cn("h-4 w-4", c.favorito ? "fill-warning text-warning" : "text-muted-foreground")} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{c.descricao}</p>
            <div>
              <div className="flex items-center justify-between text-[0.7rem]">
                <span className={`rounded-md px-2 py-0.5 font-semibold ${statusClass[c.status]}`}>{c.status}</span>
                <span className="font-bold tabular-nums">{c.progresso}%</span>
              </div>
              <Progress value={c.progresso} className="mt-1.5 h-1.5" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <a href={c.linkCurso} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" /> Curso
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={c.linkVideo} target="_blank" rel="noreferrer">
                  <PlayCircle className="h-3.5 w-3.5" /> Vídeo
                </a>
              </Button>
              <span className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                <FileDown className="h-3.5 w-3.5" /> {c.material}
              </span>
            </div>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum curso encontrado com os filtros atuais.</p>
        )}
      </div>
    </div>
  );
}
