export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      acessos: {
        Row: {
          created_at: string
          email: string | null
          id: string
          metodo: string
          nome: string
          org_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          metodo?: string
          nome?: string
          org_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          metodo?: string
          nome?: string
          org_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "acessos_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      atividades: {
        Row: {
          assunto: string
          created_at: string
          deleted_at: string | null
          equipe_id: string | null
          id: string
          org_id: string | null
          owner_id: string | null
          relacionado: string | null
          responsavel: string
          status: string
          tipo: string
          updated_at: string
          vencimento: string | null
        }
        Insert: {
          assunto: string
          created_at?: string
          deleted_at?: string | null
          equipe_id?: string | null
          id?: string
          org_id?: string | null
          owner_id?: string | null
          relacionado?: string | null
          responsavel?: string
          status?: string
          tipo?: string
          updated_at?: string
          vencimento?: string | null
        }
        Update: {
          assunto?: string
          created_at?: string
          deleted_at?: string | null
          equipe_id?: string | null
          id?: string
          org_id?: string | null
          owner_id?: string | null
          relacionado?: string | null
          responsavel?: string
          status?: string
          tipo?: string
          updated_at?: string
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atividades_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      auditoria: {
        Row: {
          acao: string
          campo: string | null
          created_at: string
          entidade: string
          id: string
          org_id: string | null
          origem: string
          registro_id: string | null
          registro_titulo: string | null
          user_id: string | null
          usuario_nome: string | null
          valor_anterior: string | null
          valor_novo: string | null
        }
        Insert: {
          acao: string
          campo?: string | null
          created_at?: string
          entidade: string
          id?: string
          org_id?: string | null
          origem?: string
          registro_id?: string | null
          registro_titulo?: string | null
          user_id?: string | null
          usuario_nome?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Update: {
          acao?: string
          campo?: string | null
          created_at?: string
          entidade?: string
          id?: string
          org_id?: string | null
          origem?: string
          registro_id?: string | null
          registro_titulo?: string | null
          user_id?: string | null
          usuario_nome?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      cadencia_etapas: {
        Row: {
          assunto: string
          cadencia_id: string
          canal: string
          created_at: string
          dias_apos: number
          id: string
          ordem: number
          org_id: string | null
          roteiro: string | null
          updated_at: string
        }
        Insert: {
          assunto: string
          cadencia_id: string
          canal?: string
          created_at?: string
          dias_apos?: number
          id?: string
          ordem?: number
          org_id?: string | null
          roteiro?: string | null
          updated_at?: string
        }
        Update: {
          assunto?: string
          cadencia_id?: string
          canal?: string
          created_at?: string
          dias_apos?: number
          id?: string
          ordem?: number
          org_id?: string | null
          roteiro?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cadencia_etapas_cadencia_id_fkey"
            columns: ["cadencia_id"]
            isOneToOne: false
            referencedRelation: "cadencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cadencia_etapas_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      cadencias: {
        Row: {
          ativo: boolean
          canal_padrao: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          org_id: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          canal_padrao?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          org_id?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          canal_padrao?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          org_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cadencias_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      campanhas: {
        Row: {
          canal: string
          cliques: number
          conversoes: number
          created_at: string
          fim: string | null
          id: string
          impressoes: number
          inicio: string | null
          investimento: number
          leads_gerados: number
          nome: string
          org_id: string | null
          receita: number
          updated_at: string
        }
        Insert: {
          canal?: string
          cliques?: number
          conversoes?: number
          created_at?: string
          fim?: string | null
          id?: string
          impressoes?: number
          inicio?: string | null
          investimento?: number
          leads_gerados?: number
          nome: string
          org_id?: string | null
          receita?: number
          updated_at?: string
        }
        Update: {
          canal?: string
          cliques?: number
          conversoes?: number
          created_at?: string
          fim?: string | null
          id?: string
          impressoes?: number
          inicio?: string | null
          investimento?: number
          leads_gerados?: number
          nome?: string
          org_id?: string | null
          receita?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          compras: number
          contato: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          empresa: string
          empresa_id: string | null
          equipe_id: string | null
          frequencia_meses: number
          id: string
          ltv: number
          observacoes: string | null
          org_id: string | null
          owner_id: string | null
          risco_churn: string
          segmento: string
          ultimo_contato: string | null
          updated_at: string
        }
        Insert: {
          compras?: number
          contato?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empresa: string
          empresa_id?: string | null
          equipe_id?: string | null
          frequencia_meses?: number
          id?: string
          ltv?: number
          observacoes?: string | null
          org_id?: string | null
          owner_id?: string | null
          risco_churn?: string
          segmento?: string
          ultimo_contato?: string | null
          updated_at?: string
        }
        Update: {
          compras?: number
          contato?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empresa?: string
          empresa_id?: string | null
          equipe_id?: string | null
          frequencia_meses?: number
          id?: string
          ltv?: number
          observacoes?: string | null
          org_id?: string | null
          owner_id?: string | null
          risco_churn?: string
          segmento?: string
          ultimo_contato?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos: {
        Row: {
          categoria: string
          created_at: string
          descricao: string | null
          favorito: boolean
          id: string
          link_curso: string | null
          link_video: string | null
          material: string | null
          nome: string
          org_id: string | null
          progresso: number
          status: string
          trilha: string | null
          updated_at: string
        }
        Insert: {
          categoria?: string
          created_at?: string
          descricao?: string | null
          favorito?: boolean
          id?: string
          link_curso?: string | null
          link_video?: string | null
          material?: string | null
          nome: string
          org_id?: string | null
          progresso?: number
          status?: string
          trilha?: string | null
          updated_at?: string
        }
        Update: {
          categoria?: string
          created_at?: string
          descricao?: string | null
          favorito?: boolean
          id?: string
          link_curso?: string | null
          link_video?: string | null
          material?: string | null
          nome?: string
          org_id?: string | null
          progresso?: number
          status?: string
          trilha?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cursos_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          cliente: string | null
          cliente_id: string | null
          created_at: string
          id: string
          nome: string
          org_id: string | null
          tipo: string
          updated_at: string
          url: string | null
        }
        Insert: {
          cliente?: string | null
          cliente_id?: string | null
          created_at?: string
          id?: string
          nome: string
          org_id?: string | null
          tipo?: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          cliente?: string | null
          cliente_id?: string | null
          created_at?: string
          id?: string
          nome?: string
          org_id?: string | null
          tipo?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      dominios_permitidos: {
        Row: {
          created_at: string
          dominio: string
        }
        Insert: {
          created_at?: string
          dominio: string
        }
        Update: {
          created_at?: string
          dominio?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          cidade: string | null
          created_at: string
          id: string
          nome: string
          org_id: string | null
          porte: string
          segmento: string
          site: string | null
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          id?: string
          nome: string
          org_id?: string | null
          porte?: string
          segmento?: string
          site?: string | null
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          id?: string
          nome?: string
          org_id?: string | null
          porte?: string
          segmento?: string
          site?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresas_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      equipes: {
        Row: {
          created_at: string
          descricao: string | null
          gestor_id: string | null
          id: string
          nome: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          gestor_id?: string | null
          id?: string
          nome: string
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          gestor_id?: string | null
          id?: string
          nome?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_mensal: {
        Row: {
          created_at: string
          despesas_operacionais: number
          folha: number
          id: string
          leads_gerados: number
          marketing: number
          mes_ref: string
          meta: number
          org_id: string | null
          receita: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          despesas_operacionais?: number
          folha?: number
          id?: string
          leads_gerados?: number
          marketing?: number
          mes_ref: string
          meta?: number
          org_id?: string | null
          receita?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          despesas_operacionais?: number
          folha?: number
          id?: string
          leads_gerados?: number
          marketing?: number
          mes_ref?: string
          meta?: number
          org_id?: string | null
          receita?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_mensal_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          campanha: string | null
          campanha_id: string | null
          cargo: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          empresa: string | null
          equipe_id: string | null
          id: string
          nome: string
          org_id: string | null
          origem: string
          owner_id: string | null
          responsavel: string
          score: number
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          campanha?: string | null
          campanha_id?: string | null
          cargo?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empresa?: string | null
          equipe_id?: string | null
          id?: string
          nome: string
          org_id?: string | null
          origem?: string
          owner_id?: string | null
          responsavel?: string
          score?: number
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          campanha?: string | null
          campanha_id?: string | null
          cargo?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empresa?: string | null
          equipe_id?: string | null
          id?: string
          nome?: string
          org_id?: string | null
          origem?: string
          owner_id?: string | null
          responsavel?: string
          score?: number
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      membros: {
        Row: {
          ativo: boolean
          created_at: string
          email: string | null
          equipe_id: string | null
          id: string
          nome: string | null
          org_id: string
          papel: Database["public"]["Enums"]["app_papel"]
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          equipe_id?: string | null
          id?: string
          nome?: string | null
          org_id: string
          papel?: Database["public"]["Enums"]["app_papel"]
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          equipe_id?: string | null
          id?: string
          nome?: string | null
          org_id?: string
          papel?: Database["public"]["Enums"]["app_papel"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membros_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membros_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      metas: {
        Row: {
          created_at: string
          equipe_id: string | null
          id: string
          mes_ref: string
          meta_leads: number
          meta_negocios: number
          meta_receita: number
          org_id: string | null
          owner_id: string | null
          responsavel: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          equipe_id?: string | null
          id?: string
          mes_ref: string
          meta_leads?: number
          meta_negocios?: number
          meta_receita?: number
          org_id?: string | null
          owner_id?: string | null
          responsavel: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          equipe_id?: string | null
          id?: string
          mes_ref?: string
          meta_leads?: number
          meta_negocios?: number
          meta_receita?: number
          org_id?: string | null
          owner_id?: string | null
          responsavel?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "metas_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metas_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidades: {
        Row: {
          cliente: string
          cliente_id: string | null
          created_at: string
          deleted_at: string | null
          equipe_id: string | null
          etapa: string
          fechamento_previsto: string | null
          id: string
          lead_id: string | null
          org_id: string | null
          owner_id: string | null
          probabilidade: number
          responsavel: string
          updated_at: string
          valor: number
        }
        Insert: {
          cliente: string
          cliente_id?: string | null
          created_at?: string
          deleted_at?: string | null
          equipe_id?: string | null
          etapa?: string
          fechamento_previsto?: string | null
          id?: string
          lead_id?: string | null
          org_id?: string | null
          owner_id?: string | null
          probabilidade?: number
          responsavel?: string
          updated_at?: string
          valor?: number
        }
        Update: {
          cliente?: string
          cliente_id?: string | null
          created_at?: string
          deleted_at?: string | null
          equipe_id?: string | null
          etapa?: string
          fechamento_previsto?: string | null
          id?: string
          lead_id?: string | null
          org_id?: string | null
          owner_id?: string | null
          probabilidade?: number
          responsavel?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "oportunidades_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      organizacoes: {
        Row: {
          created_at: string
          dominio: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dominio?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dominio?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      perfis: {
        Row: {
          avatar_url: string | null
          cargo: string
          created_at: string
          email: string | null
          empresa: string
          id: string
          nome: string
          org_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string
          created_at?: string
          email?: string | null
          empresa?: string
          id: string
          nome?: string
          org_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cargo?: string
          created_at?: string
          email?: string | null
          empresa?: string
          id?: string
          nome?: string
          org_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfis_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      permissoes_papel: {
        Row: {
          acao: string
          created_at: string
          id: string
          org_id: string
          papel: Database["public"]["Enums"]["app_papel"]
          permitido: boolean
          updated_at: string
        }
        Insert: {
          acao: string
          created_at?: string
          id?: string
          org_id: string
          papel: Database["public"]["Enums"]["app_papel"]
          permitido?: boolean
          updated_at?: string
        }
        Update: {
          acao?: string
          created_at?: string
          id?: string
          org_id?: string
          papel?: Database["public"]["Enums"]["app_papel"]
          permitido?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_papel_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas: {
        Row: {
          cliente: string
          cliente_id: string | null
          created_at: string
          data_venda: string
          deleted_at: string | null
          dias_fechamento: number
          equipe_id: string | null
          id: string
          oportunidade_id: string | null
          org_id: string | null
          owner_id: string | null
          produto: string
          updated_at: string
          valor: number
          vendedor: string
        }
        Insert: {
          cliente: string
          cliente_id?: string | null
          created_at?: string
          data_venda?: string
          deleted_at?: string | null
          dias_fechamento?: number
          equipe_id?: string | null
          id?: string
          oportunidade_id?: string | null
          org_id?: string | null
          owner_id?: string | null
          produto?: string
          updated_at?: string
          valor?: number
          vendedor?: string
        }
        Update: {
          cliente?: string
          cliente_id?: string | null
          created_at?: string
          data_venda?: string
          deleted_at?: string | null
          dias_fechamento?: number
          equipe_id?: string | null
          id?: string
          oportunidade_id?: string | null
          org_id?: string | null
          owner_id?: string | null
          produto?: string
          updated_at?: string
          valor?: number
          vendedor?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      equipe_atual: { Args: never; Returns: string }
      org_atual: { Args: never; Returns: string }
      papel_atual: {
        Args: never
        Returns: Database["public"]["Enums"]["app_papel"]
      }
      pode_escrever: { Args: never; Returns: boolean }
      pode_excluir: { Args: never; Returns: boolean }
      pode_ver: {
        Args: { _equipe: string; _org: string; _owner: string }
        Returns: boolean
      }
      pode_ver_org: { Args: { _org: string }; Returns: boolean }
      tem_papel: {
        Args: { _papeis: Database["public"]["Enums"]["app_papel"][] }
        Returns: boolean
      }
    }
    Enums: {
      app_papel: "administrador" | "gestor" | "vendedor" | "visualizador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_papel: ["administrador", "gestor", "vendedor", "visualizador"],
    },
  },
} as const
