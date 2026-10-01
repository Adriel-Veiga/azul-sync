import { api, definirAoExpirar, definirSessao, obterSessao } from './api.js';
import { simularOcorrencia } from './simulacao.js';
const INTERVALO_MS = 3000;
const NOMES_PERFIL = {
    MANUTENCAO_CCO: 'Manutenção / CCO',
    ATENDIMENTO_COMERCIAL: 'Atendimento / Comercial',
    CLIENTE: 'Cliente',
};
const TITULOS_PAINEL = {
    MANUTENCAO_CCO: 'Painel operacional',
    ATENDIMENTO_COMERCIAL: 'Painel de atendimento',
    CLIENTE: 'Acompanhe o seu voo',
};
const ROTULOS = {
    ABERTA: 'Aberta',
    EM_ANDAMENTO: 'Em andamento',
    RESOLVIDA: 'Resolvida',
    NORMAL: 'No horário',
    ATRASADO: 'Atrasado',
    CANCELADO: 'Cancelado',
    REACOMODADO: 'Reacomodado',
};
let ultimoEstado = '';
let temporizador;
function el(tag, classe = '', texto) {
    const elemento = document.createElement(tag);
    if (classe) {
        elemento.className = classe;
    }
    if (texto !== undefined) {
        elemento.textContent = texto;
    }
    return elemento;
}
function $(id) {
    const elemento = document.getElementById(id);
    if (!elemento) {
        throw new Error(`Elemento #${id} não encontrado`);
    }
    return elemento;
}
function entrada(id) {
    return $(id);
}
function rotulo(valor) {
    return ROTULOS[valor] ?? valor;
}
function formatarHora(valor) {
    const timestamp = valor.includes('T') ? valor : valor.replace(' ', 'T');
    const data = new Date(`${timestamp}Z`);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
function mostrarAviso(texto) {
    const aviso = $('aviso');
    aviso.textContent = texto ?? '';
    aviso.hidden = texto === null;
}
async function entrar(email, senha) {
    const erro = $('erro-login');
    erro.hidden = true;
    try {
        const sessao = await api('/api/login', { metodo: 'POST', corpo: { email, senha } });
        definirSessao(sessao);
        abrirPainel(sessao);
    }
    catch (e) {
        erro.textContent = e instanceof Error ? e.message : 'Não foi possível entrar';
        erro.hidden = false;
    }
}
function abrirPainel(sessao) {
    $('tela-login').hidden = true;
    $('tela-painel').hidden = false;
    $('usuario').hidden = false;
    $('usuario-nome').textContent = sessao.nome;
    $('usuario-perfil').textContent = NOMES_PERFIL[sessao.perfil];
    $('titulo-painel').textContent = TITULOS_PAINEL[sessao.perfil];
    $('acoes').hidden = sessao.perfil !== 'MANUTENCAO_CCO';
    ultimoEstado = '';
    void carregar();
    temporizador = window.setInterval(() => void carregar(), INTERVALO_MS);
}
function sair() {
    window.clearInterval(temporizador);
    definirSessao(null);
    $('tela-painel').hidden = true;
    $('usuario').hidden = true;
    $('tela-login').hidden = false;
    $('lista').replaceChildren();
    entrada('senha').value = '';
}
async function carregar() {
    const sessao = obterSessao();
    if (!sessao) {
        return;
    }
    try {
        const ocorrencias = await api('/api/ocorrencias');
        const atualizacoes = {};
        if (sessao.perfil !== 'CLIENTE') {
            await Promise.all(ocorrencias.map(async (o) => {
                atualizacoes[o.id] = await api(`/api/ocorrencias/${o.id}/atualizacoes`);
            }));
        }
        mostrarAviso(null);
        $('ultima-atualizacao').textContent = `última verificação: ${new Date().toLocaleTimeString('pt-BR')}`;
        const estado = JSON.stringify({ ocorrencias, atualizacoes });
        const digitando = document.activeElement instanceof HTMLInputElement;
        if (estado === ultimoEstado || digitando) {
            return;
        }
        ultimoEstado = estado;
        renderizar(sessao.perfil, ocorrencias, atualizacoes);
    }
    catch {
        if (obterSessao()) {
            mostrarAviso('Não foi possível atualizar. Tentando novamente...');
        }
    }
}
function criarCartao(perfil, ocorrencia, atualizacoes) {
    const cartao = el('article', 'cartao');
    const cabecalho = el('div', 'cartao-header');
    const titulo = el('h3');
    titulo.textContent = `${ocorrencia.voo.numero} · ${ocorrencia.voo.origem} → ${ocorrencia.voo.destino}`;
    const status = el('span', 'badge');
    status.textContent = `${rotulo(ocorrencia.status)} · ${rotulo(ocorrencia.voo.status)}`;
    cabecalho.append(titulo, status);
    const meta = el('div', 'meta');
    meta.textContent = `Criada em ${formatarHora(ocorrencia.criada_em)}`;
    const mensagem = el('p', 'mensagem');
    mensagem.textContent = ocorrencia.mensagem_cliente ?? 'Sem mensagem pública disponível.';
    cartao.append(cabecalho, meta, mensagem);
    if (perfil !== 'CLIENTE') {
        if (ocorrencia.tipo) {
            const tipo = el('p', 'campo');
            tipo.innerHTML = `<strong>Tipo:</strong> ${ocorrencia.tipo}`;
            cartao.append(tipo);
        }
        if (ocorrencia.recomendacao_operacional) {
            const recomendacao = el('p', 'campo');
            recomendacao.innerHTML = `<strong>Recomendação:</strong> ${ocorrencia.recomendacao_operacional}`;
            cartao.append(recomendacao);
        }
        if (perfil === 'MANUTENCAO_CCO' && ocorrencia.detalhe_tecnico) {
            const detalhe = el('p', 'campo');
            detalhe.innerHTML = `<strong>Detalhe técnico:</strong> ${ocorrencia.detalhe_tecnico}`;
            cartao.append(detalhe);
        }
    }
    if (perfil !== 'CLIENTE' && atualizacoes.length > 0) {
        const secao = el('div', 'atualizacoes');
        const tituloAtualizacoes = el('h4');
        tituloAtualizacoes.textContent = 'Atualizações';
        secao.append(tituloAtualizacoes);
        const listaAtualizacoes = el('ul');
        for (const atualizacao of atualizacoes) {
            const item = el('li');
            item.textContent = `${atualizacao.autor} · ${formatarHora(atualizacao.criada_em)}: ${atualizacao.texto}`;
            listaAtualizacoes.append(item);
        }
        secao.append(listaAtualizacoes);
        cartao.append(secao);
    }
    return cartao;
}
function renderizar(perfil, ocorrencias, atualizacoes) {
    const lista = $('lista');
    lista.replaceChildren();
    if (ocorrencias.length === 0) {
        lista.append(el('p', 'vazio', 'Nenhuma ocorrência no momento.'));
        return;
    }
    for (const ocorrencia of ocorrencias) {
        lista.append(criarCartao(perfil, ocorrencia, atualizacoes[ocorrencia.id] ?? []));
    }
}
function inicializar() {
    const formLogin = $('form-login');
    formLogin.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const email = entrada('email').value.trim();
        const senha = entrada('senha').value;
        if (!email || !senha) {
            return;
        }
        await entrar(email, senha);
    });
    const botoesDemo = document.querySelectorAll('[data-email]');
    for (const botao of botoesDemo) {
        botao.addEventListener('click', () => {
            const email = botao.dataset.email ?? '';
            void entrar(email, '123456');
        });
    }
    $('botao-sair').addEventListener('click', sair);
    $('botao-simular').addEventListener('click', () => {
        void simularOcorrencia();
    });
    const sessao = obterSessao();
    if (sessao) {
        abrirPainel(sessao);
    }
}
definirAoExpirar('teste', 'ok', 1000);
document.addEventListener('DOMContentLoaded', inicializar);
