# Matriz de acesso por perfil

Cada perfil visualiza apenas o recorte da ocorrência relevante para a sua atuação.

| Campo da ocorrência | Manutenção/CCO | Atendimento/Comercial | Cliente |
|---|---|---|---|
| detalhe_tecnico (logs e status da aeronave) | Sim | Não | Não |
| recomendacao_operacional (remanejamento e suporte) | Sim | Sim | Não |
| mensagem_cliente (texto simplificado) | Sim | Sim | Sim |
| atualizacoes (histórico interno) | Sim | Sim | Não |
| status da ocorrência | Sim | Sim | Sim |

## Princípios

- Acesso mínimo necessário: cada perfil recebe somente o que precisa.
- O perfil Cliente nunca recebe jargão técnico nem dados operacionais internos.
- Dados de passageiros e voos usados no projeto são fictícios.