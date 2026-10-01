import test from 'node:test';
import assert from 'node:assert/strict';
import { filtrarOcorrencia } from './visibilidade';
import type { LinhaOcorrencia } from './tipos';

const exemplo: LinhaOcorrencia = {
  id: 1,
  voo_id: 1,
  tipo: 'PANE_TECNICA',
  status: 'ABERTA',
  detalhe_tecnico: 'Falha no sensor hidráulico (código HYD-B-204)',
  recomendacao_operacional: 'Reacomodar passageiros no próximo voo',
  mensagem_cliente: 'Seu voo precisa de uma verificação adicional.',
  criada_em: '2026-10-01 10:00:00',
  voo_numero: 'AD1234',
  origem: 'VCP',
  destino: 'SDU',
  voo_status: 'ATRASADO',
};

test('cliente não recebe campos técnicos nem operacionais', () => {
  const r = filtrarOcorrencia(exemplo, 'CLIENTE');
  assert.equal(r.detalhe_tecnico, undefined);
  assert.equal(r.recomendacao_operacional, undefined);
  assert.equal(r.tipo, undefined);
  assert.ok(r.mensagem_cliente);
});

test('atendimento não recebe o detalhe técnico', () => {
  const r = filtrarOcorrencia(exemplo, 'ATENDIMENTO_COMERCIAL');
  assert.equal(r.detalhe_tecnico, undefined);
  assert.ok(r.recomendacao_operacional);
});

test('CCO recebe todos os campos', () => {
  const r = filtrarOcorrencia(exemplo, 'MANUTENCAO_CCO');
  assert.ok(r.detalhe_tecnico);
  assert.ok(r.recomendacao_operacional);
});