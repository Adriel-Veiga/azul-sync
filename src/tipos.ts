//TIPOS DE DADOS E INTERFACES
export type PerfilNome = 'MANUTENCAO_CCO' | 'ATENDIMENTO_COMERCIAL' | 'CLIENTE';
export type StatusOcorrencia = 'ABERTA' | 'EM_ANDAMENTO' | 'RESOLVIDA';
export type StatusVoo = 'NORMAL' | 'ATRASADO' | 'CANCELADO' | 'REACOMODADO';

export interface LinhaOcorrencia {
  id: number;
  voo_id: number;
  tipo: string;
  status: StatusOcorrencia;
  detalhe_tecnico: string;
  recomendacao_operacional: string | null;
  mensagem_cliente: string | null;
  criada_em: string;
  voo_numero: string;
  origem: string;
  destino: string;
  voo_status: StatusVoo;
}

export interface OcorrenciaVisivel {
  id: number;
  status: StatusOcorrencia;
  voo: { numero: string; origem: string; destino: string; status: StatusVoo };
  mensagem_cliente: string | null;
  criada_em: string;
  tipo?: string;
  recomendacao_operacional?: string | null;
  detalhe_tecnico?: string;
}

export interface Sessao {
  usuarioId: number;
  nome: string;
  perfil: PerfilNome;
}
