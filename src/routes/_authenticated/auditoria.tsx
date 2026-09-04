import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RegistroTimeline } from "@/components/registro-timeline";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  acaoAuditoriaLabel,
  entidadeLabel,
  formatarDataHora,
  origemLabel,
  useAuditoria,
} from "@/lib/auditoria";
import { papelLabel, usePermissao } from "@/lib/permissoes";

export const Route = createFileRoute("/_authenticated/auditoria")({
  head: () => ({
    meta: [
      { title: "Auditoria | CRM Intelligence Hub" },
      {
        name: "description",
        content:
          "Histórico completo de alterações do CRM: usuário, data, campo alterado, valor anterior, novo valor e origem da ação.",
      },
      { property: "og:title", content: "Auditoria do CRM Intelligence Hub" },
      {
        property: "og:description",
        content: "Rastreie quem alterou o quê, quando e por qual origem.",
      },
    ],
  }),
  component: AuditoriaPage,
});

const PAGINA = 25;

function AuditoriaPage() {
  const { pode, papel, carregando } = usePermissao();
  const [entidade, setEntidade] = useState("todas");
  const [acao, setAcao] = useState("todas");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [detalhe, setDetalhe] = useState<{ entidade: string; id: string; titulo: string } | null>(null);

  const filtro = useMemo(
    () => ({
      ...(entidade !== "todas" ? { entidade } : {}),
      ...(acao !== "todas" ? { acao } : {}),
      busca,
    }),
    [entidade, acao, busca],
  );

  const { data, isLoading, isError, error } = useAuditoria(filtro);
  const total = data?.length ?? 0;
  const paginas = Math.max(1, Math.ceil(total / PAGINA));
  const paginaAtual = Math.min(pagina, paginas);
  const visiveis = (data ?? []).slice((paginaAtual - 1) * PAGINA, paginaAtual * PAGINA);

  const exportar = () => {
    const linhas = [
      ["Data/Hora", "Usuário", "Entidade", "Registro", "Ação", "Campo", "Anterior", "Novo", "Origem"],
      ...(data ?? []).map((e) => [
        formatarDataHora(e.created_at),
        e.usuario_nome ?? "",
        entidadeLabel[e.entidade] ?? e.entidade,
        e.registro_titulo ?? "",
        acaoAuditoriaLabel[e.acao] ?? e.acao,
        e.campo ?? "",
        e.valor_anterior ?? "",
        e.valor_novo ?? "",
        origemLabel[e.origem] ?? e.origem,
      ]),
    ];
    const csv = linhas.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "auditoria-crm.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (carregando) return <Skeleton className="h-64 w-full" />;

  if (!pode("auditoria")) {
    return (
      <div className="space-y-4">
        <PageHeader title="Auditoria" />
        <Card className="flex items-start gap-3 p-6">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
          <p className="text-sm">
            Seu papel ({papel ? papelLabel[papel] : "sem vínculo"}) não tem permissão para acessar a
            auditoria. Solicite acesso a um administrador.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Auditoria"
        description="Todas as alterações relevantes registradas com usuário, data, campo, valores e origem."
        actions={
          <Button variant="outline" onClick={exportar} disabled={total === 0}>
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        }
      />

      <Card className="flex flex-wrap items-center gap-2 p-4">
        <Input
          placeholder="Buscar registro, campo ou valor"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPagina(1);
          }}
          className="max-w-xs"
        />
        <Select
          value={entidade}
          onValueChange={(v) => {
            setEntidade(v);
            setPagina(1);
          }}
        >
          <SelectTrigger className="w-[11rem]">
            <SelectValue placeholder="Entidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as entidades</SelectItem>
            {Object.entries(entidadeLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={acao}
          onValueChange={(v) => {
            setAcao(v);
            setPagina(1);
          }}
        >
          <SelectTrigger className="w-[13rem]">
            <SelectValue placeholder="Ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as ações</SelectItem>
            {Object.entries(acaoAuditoriaLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary">{total} evento(s)</Badge>
      </Card>

      {isLoading && <Skeleton className="h-64 w-full" />}
      {isError && (
        <Card className="p-6 text-sm text-destructive">
          Não foi possível carregar a auditoria: {(error as Error).message}
        </Card>
      )}

      {!isLoading && !isError && total === 0 && (
        <Card className="p-6 text-sm text-muted-foreground">
          Nenhum evento encontrado com os filtros atuais. Crie ou edite um lead para ver o histórico aparecer
          aqui.
        </Card>
      )}

      {visiveis.length > 0 && (
        <>
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Campo</TableHead>
                  <TableHead>Anterior → Novo</TableHead>
                  <TableHead>Origem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiveis.map((e) => (
                  <TableRow
                    key={e.id}
                    className="cursor-pointer"
                    onClick={() =>
                      e.registro_id &&
                      setDetalhe({
                        entidade: e.entidade,
                        id: e.registro_id,
                        titulo: e.registro_titulo ?? "Registro",
                      })
                    }
                  >
                    <TableCell className="whitespace-nowrap text-xs">
                      {formatarDataHora(e.created_at)}
                    </TableCell>
                    <TableCell className="text-xs font-medium">{e.usuario_nome ?? "Sistema"}</TableCell>
                    <TableCell className="text-xs">{entidadeLabel[e.entidade] ?? e.entidade}</TableCell>
                    <TableCell className="max-w-[12rem] truncate text-xs">
                      {e.registro_titulo ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs">{acaoAuditoriaLabel[e.acao] ?? e.acao}</TableCell>
                    <TableCell className="text-xs">{e.campo ?? "—"}</TableCell>
                    <TableCell className="max-w-[16rem] text-xs">
                      {e.campo ? (
                        <span>
                          <span className="text-muted-foreground line-through">
                            {e.valor_anterior || "vazio"}
                          </span>{" "}
                          → <span className="font-semibold">{e.valor_novo || "vazio"}</span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{origemLabel[e.origem] ?? e.origem}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Página {paginaAtual} de {paginas}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual <= 1}
                onClick={() => setPagina(paginaAtual - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual >= paginas}
                onClick={() => setPagina(paginaAtual + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}

      <Sheet open={Boolean(detalhe)} onOpenChange={(o) => !o && setDetalhe(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="truncate">{detalhe?.titulo}</SheetTitle>
          </SheetHeader>
          {detalhe && (
            <div className="mt-4">
              <RegistroTimeline
                entidade={detalhe.entidade}
                registroId={detalhe.id}
                titulo={`Histórico · ${entidadeLabel[detalhe.entidade] ?? detalhe.entidade}`}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
