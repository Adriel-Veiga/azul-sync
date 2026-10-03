//GERADOR DE OCORRÊNCIAS 
import { api } from './api.js';

const MODELOS = [
  {
    tipo: 'PANE_TECNICA',
    detalheTecnico: 'Alerta de pressão no sistema hidráulico A (código HYD-A-117). Inspeção em solo em andamento.',
    recomendacaoOperacional: 'Preparar reacomodação e alimentação para possível atraso superior a 2h.',
  },
  {
    tipo: 'CONDICAO_METEOROLOGICA',
    detalheTecnico: 'Teto baixo e rajadas acima do limite no aeroporto de destino. Janela de pouso prevista em 90 min.',
    recomendacaoOperacional: 'Avisar passageiros sobre ajuste de horário e manter o balcão informado.',
  },
  {
    tipo: 'ATRASO_TRIPULACAO',
    detalheTecnico: 'Tripulação reserva acionada após extrapolação do limite de jornada. Chegada prevista em 45 min.',
    recomendacaoOperacional: 'Informar novo horário estimado e oferecer assistência de alimentação.',
  },
];

export async function simularOcorrencia(): Promise<void> {
  const modelo = MODELOS[Math.floor(Math.random() * MODELOS.length)];
  if (!modelo) {
    return;
  }
  // voo 1 é o voo da passageira de demonstração
  await api('/api/ocorrencias', { metodo: 'POST', corpo: { vooId: 1, ...modelo } });
}