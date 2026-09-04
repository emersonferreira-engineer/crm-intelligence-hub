import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, Loader2, Plus, ShieldCheck, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  acaoLabel,
  acoes,
  papeis,
  papelDescricao,
  papelLabel,
  useAtualizarMembro,
  useAtualizarPermissao,
  useEquipes,
  useMembros,
  useOrganizacao,
  usePermissao,
  usePermissoes,
  useSalvarEquipe,
} from "@/lib/permissoes";

export const Route = createFileRoute("/_authenticated/configuracoes/equipe")({
  head: () => ({
    meta: [
      { title: "Empresa, equipes e permissões | CRM Intelligence Hub" },
      {
        name: "description",
        content:
          "Gerencie a empresa, equipes, usuários, papéis e a matriz de permissões do CRM Intelligence Hub.",
      },
      { property: "og:title", content: "Empresa, equipes e permissões" },
      {
        property: "og:description",
        content: "Administração de organização, equipes, papéis e matriz de permissões.",
      },
    ],
  }),
  component: ConfigEquipePage,
});

function ConfigEquipePage() {
  const { isAdmin, papel, carregando } = usePermissao();
  const { data: org } = useOrganizacao();
  const { data: equipes, isLoading: carregandoEquipes } = useEquipes();
  const { data: membros, isLoading: carregandoMembros, isError: erroMembros } = useMembros();
  const { data: matriz } = usePermissoes();

  const salvarEquipe = useSalvarEquipe();
  const atualizarMembro = useAtualizarMembro();
  const atualizarPermissao = useAtualizarPermissao();

  const [novaEquipe, setNovaEquipe] = useState("");
  const [busca, setBusca] = useState("");

  const membrosFiltrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    const lista = membros ?? [];
    if (!t) return lista;
    return lista.filter((m) =>
      [m.nome, m.email, papelLabel[m.papel]].filter(Boolean).some((v) => String(v).toLowerCase().includes(t)),
    );
  }, [membros, busca]);

  if (carregando) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <PageHeader title="Empresa, equipes e permissões" />
        <Card className="p-6">
          <p className="text-sm">
            Seu papel atual é <strong>{papel ? papelLabel[papel] : "sem vínculo"}</strong>. Apenas
            administradores podem gerenciar usuários, equipes e permissões.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Empresa, equipes e permissões"
        description="Fundação multiempresa: organização proprietária dos dados, equipes, papéis e matriz de permissões."
      />

      <Card className="flex flex-wrap items-center gap-4 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{org?.nome ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            Domínio corporativo: @{org?.dominio ?? "—"} · Todos os registros pertencem a esta empresa e são
            isolados de outras organizações.
          </p>
        </div>
      </Card>

      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="equipes">Equipes</TabsTrigger>
          <TabsTrigger value="permissoes">Matriz de permissões</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar por nome, e-mail ou papel"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="max-w-sm"
            />
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" /> {membrosFiltrados.length} usuário(s)
            </Badge>
          </div>

          {carregandoMembros && <Skeleton className="h-40 w-full" />}
          {erroMembros && <p className="text-sm text-destructive">Não foi possível carregar os usuários.</p>}

          {!carregandoMembros && membrosFiltrados.length === 0 && (
            <Card className="p-6 text-sm text-muted-foreground">
              Nenhum usuário encontrado. Novos integrantes aparecem aqui após o primeiro acesso com e-mail do
              domínio corporativo.
            </Card>
          )}

          {membrosFiltrados.length > 0 && (
            <Card className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Equipe</TableHead>
                    <TableHead className="text-right">Ativo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membrosFiltrados.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.nome ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{m.email ?? "—"}</TableCell>
                      <TableCell>
                        <Select
                          value={m.papel}
                          onValueChange={(v) =>
                            atualizarMembro.mutate({ id: m.id, values: { papel: v as typeof m.papel } })
                          }
                        >
                          <SelectTrigger className="h-8 w-[9.5rem]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {papeis.map((p) => (
                              <SelectItem key={p} value={p}>
                                {papelLabel[p]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={m.equipe_id ?? "sem"}
                          onValueChange={(v) =>
                            atualizarMembro.mutate({
                              id: m.id,
                              values: { equipe_id: v === "sem" ? null : v },
                            })
                          }
                        >
                          <SelectTrigger className="h-8 w-[11rem]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sem">Sem equipe</SelectItem>
                            {equipes?.map((e) => (
                              <SelectItem key={e.id} value={e.id}>
                                {e.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={m.ativo}
                          onCheckedChange={(v) => atualizarMembro.mutate({ id: m.id, values: { ativo: v } })}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          <Card className="space-y-2 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="h-4 w-4 text-primary" /> Papéis disponíveis
            </h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {papeis.map((p) => (
                <li key={p}>
                  <strong className="text-foreground">{papelLabel[p]}</strong> — {papelDescricao[p]}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="equipes" className="space-y-3">
          <Card className="flex flex-wrap items-end gap-3 p-4">
            <div className="min-w-[14rem] flex-1 space-y-1.5">
              <Label htmlFor="nova-equipe">Nova equipe</Label>
              <Input
                id="nova-equipe"
                placeholder="Ex.: Inside Sales SP"
                value={novaEquipe}
                onChange={(e) => setNovaEquipe(e.target.value)}
              />
            </div>
            <Button
              disabled={novaEquipe.trim().length < 2 || salvarEquipe.isPending}
              onClick={() =>
                salvarEquipe.mutate(
                  { nome: novaEquipe.trim() },
                  { onSuccess: () => setNovaEquipe("") },
                )
              }
            >
              {salvarEquipe.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Criar equipe
            </Button>
          </Card>

          {carregandoEquipes && <Skeleton className="h-24 w-full" />}
          {!carregandoEquipes && (equipes?.length ?? 0) === 0 && (
            <Card className="p-6 text-sm text-muted-foreground">Nenhuma equipe cadastrada.</Card>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {equipes?.map((e) => (
              <Card key={e.id} className="space-y-1 p-4">
                <p className="text-sm font-bold">{e.nome}</p>
                <p className="text-xs text-muted-foreground">{e.descricao ?? "Sem descrição"}</p>
                <p className="text-xs text-muted-foreground">
                  {membros?.filter((m) => m.equipe_id === e.id).length ?? 0} integrante(s)
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissoes" className="space-y-3">
          <p className="text-sm text-muted-foreground">
            A matriz define o que cada papel pode fazer. As regras também são aplicadas no backend — ocultar
            um botão não libera a ação.
          </p>
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ação</TableHead>
                  {papeis.map((p) => (
                    <TableHead key={p} className="text-center">
                      {papelLabel[p]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {acoes.map((acao) => (
                  <TableRow key={acao}>
                    <TableCell className="font-medium">{acaoLabel[acao]}</TableCell>
                    {papeis.map((p) => {
                      const regra = matriz?.find((m) => m.papel === p && m.acao === acao);
                      return (
                        <TableCell key={p} className="text-center">
                          <Switch
                            checked={regra?.permitido ?? false}
                            disabled={!regra || p === "administrador"}
                            onCheckedChange={(v) =>
                              regra && atualizarPermissao.mutate({ id: regra.id, permitido: v })
                            }
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
