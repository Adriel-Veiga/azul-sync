import type { LinhaOcorrencia, OcorrenciaVisivel, PerfilNome } from './tipos';

export function filtrarOcorrencia(o: LinhaOcorrencia, perfil: PerfilNome): OcorrenciaVisivel {
  const base: OcorrenciaVisivel = {
    id: o.id,
    status: o.status,
    voo: { numero: o.voo_numero, origem: o.origem, destino: o.destino, status: o.voo_status },
    mensagem_cliente: o.mensagem_cliente,
    criada_em: o.criada_em,
  };

  if (perfil === 'CLIENTE') {
    return base;
  }
  if (perfil === 'ATENDIMENTO_COMERCIAL') {
    return { ...base, tipo: o.tipo, recomendacao_operacional: o.recomendacao_operacional };
  }
  return {
    ...base,
    tipo: o.tipo,
    recomendacao_operacional: o.recomendacao_operacional,
    detalhe_tecnico: o.detalhe_tecnico,
  };
}
