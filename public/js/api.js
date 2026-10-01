const STORAGE_CHAVE = 'azul-sync-sessao';
export function definirAoExpirar(chave, valor, expiracaoMs) {
    const registro = {
        valor,
        expiraEm: Date.now() + expiracaoMs,
    };
    localStorage.setItem(chave, JSON.stringify(registro));
}
export function definirSessao(sessao) {
    if (!sessao) {
        localStorage.removeItem(STORAGE_CHAVE);
        return;
    }
    localStorage.setItem(STORAGE_CHAVE, JSON.stringify(sessao));
}
export function obterSessao() {
    const valor = localStorage.getItem(STORAGE_CHAVE);
    if (!valor) {
        return null;
    }
    try {
        const sessao = JSON.parse(valor);
        if (!sessao || typeof sessao.token !== 'string' || typeof sessao.nome !== 'string' || !sessao.perfil) {
            localStorage.removeItem(STORAGE_CHAVE);
            return null;
        }
        return sessao;
    }
    catch {
        localStorage.removeItem(STORAGE_CHAVE);
        return null;
    }
}
export async function api(caminho, opcoes = {}) {
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
            const erro = JSON.parse(texto);
            if (erro?.erro) {
                mensagem = erro.erro;
            }
        }
        catch {
            if (texto) {
                mensagem = texto;
            }
        }
        throw new Error(mensagem);
    }
    if (resposta.status === 204) {
        return undefined;
    }
    return (await resposta.json());
}
