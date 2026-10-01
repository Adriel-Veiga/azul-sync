import type { Sessao } from './tipos.js';

const STORAGE_CHAVE = 'azul-sync-sessao';

export interface RequisicaoOpcao {
  metodo?: string;
  corpo?: unknown;
}

export function definirAoExpirar(chave: string, valor: string, expiracaoMs: number): void {
  const registro = {
    valor,
    expiraEm: Date.now() + expiracaoMs,
  };
  localStorage.setItem(chave, JSON.stringify(registro));
}

export function definirSessao(sessao: Sessao | null): void {
  if (!sessao) {
    localStorage.removeItem(STORAGE_CHAVE);
    return;
  }
  localStorage.setItem(STORAGE_CHAVE, JSON.stringify(sessao));
}

export function obterSessao(): Sessao | null {
  const valor = localStorage.getItem(STORAGE_CHAVE);
  if (!valor) {
    return null;
  }

  try {
    const sessao = JSON.parse(valor) as Partial<Sessao>;
    if (!sessao || typeof sessao.token !== 'string' || typeof sessao.nome !== 'string' || !sessao.perfil) {
      localStorage.removeItem(STORAGE_CHAVE);
      return null;
    }
    return sessao as Sessao;
  } catch {
    localStorage.removeItem(STORAGE_CHAVE);
    return null;
  }
}

export async function api<T>(caminho: string, opcoes: RequisicaoOpcao = {}): Promise<T> {
  const sessao = obterSessao();
  const cabecalhos = new Headers({
    Accept: 'application/json',
  });

  if (opcoes.corpo !== undefined) {
    cabecalhos.set('Content-Type', 'application/json');
  }

  if (sessao?.token) {
    cabecalhos.set('Authorization', `Bearer ${sessao.token}`);
  }

  const resposta = await fetch(caminho, {
    method: opcoes.metodo ?? 'GET',
    headers: cabecalhos,
    body: opcoes.corpo !== undefined ? JSON.stringify(opcoes.corpo) : undefined,
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    let mensagem = `Erro ${resposta.status}`;

    try {
      const erro = JSON.parse(texto) as { erro?: string };
      if (erro?.erro) {
        mensagem = erro.erro;
      }
    } catch {
      if (texto) {
        mensagem = texto;
      }
    }

    throw new Error(mensagem);
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}
