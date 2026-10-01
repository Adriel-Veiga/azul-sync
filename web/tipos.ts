export type Perfil = 'MANUTENCAO_CCO' | 'ATENDIMENTO_COMERCIAL' | 'CLIENTE';

export interface Voo {
  numero: string;
  origem: string;
  destino: string;
  status: string;
}

export interface Ocorrencia {
  id: number;
  status: string;
  voo: Voo;
  mensagem_cliente: string | null;
  criada_em: string;
  tipo?: string;
  recomendacao_operacional?: string | null;
  detalhe_tecnico?: string;
}

export interface Atualizacao {
  id: number;
  texto: string;
  criada_em: string;
  autor: string;
}

export interface Sessao {
  token: string;
  nome: string;
  perfil: Perfil;
}