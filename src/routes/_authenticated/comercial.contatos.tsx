import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Search } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { clientes, leads } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/comercial/contatos")({
  head: () => ({
    meta: [
      { title: "Contatos | CRM Intelligence Hub" },
      { name: "description", content: "Diretório de contatos comerciais com empresa, cargo e canais de contato." },
      { property: "og:title", content: "Contatos | CRM Intelligence Hub" },
      { property: "og:description", content: "Todos os contatos de leads e clientes em um único lugar." },
    ],
  }),
  component: ContatosPage,
});

const contatos = [
  ...leads.map((l) => ({
    nome: l.nome,
    empresa: l.empresa,
    cargo: l.cargo,
    email: l.email,
    telefone: l.telefone,
    tipo: "Lead",
    responsavel: l.responsavel,
  })),
  ...clientes.map((c) => ({
    nome: c.contatoPrincipal,
    empresa: c.empresa,
    cargo: "Contato principal",
    email: c.email,
    telefone: "+55 11 3000-0000",
    tipo: "Cliente",
    responsavel: "Customer Success",
  })),
];

function ContatosPage() {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const rows = contatos.filter(
    (c) => !term || [c.nome, c.empresa, c.email, c.cargo].some((f) => f.toLowerCase().includes(term)),
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Contatos" description={`${rows.length} contatos ativos na base`} />
      <Card className="border-border/70 shadow-card">
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar contato" className="pl-9" />
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={`${c.nome}-${c.empresa}`} className="hover:bg-muted/40">
                    <TableCell className="font-semibold">{c.nome}</TableCell>
                    <TableCell>{c.empresa}</TableCell>
                    <TableCell className="text-muted-foreground">{c.cargo}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" /> {c.email}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3" /> {c.telefone}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {c.tipo}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.responsavel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
