// Funções partilhadas por todas as páginas.

// Faz um pedido à API e devolve o JSON da resposta.
// Se a API responder com erro, lança um Error com a lista de mensagens.
async function pedirApi(url, opcoes = {}) {
  const resposta = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });
  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    const erro = new Error('Pedido falhou');
    erro.mensagens = dados.erros || ['Ocorreu um erro. Tente novamente.'];
    throw erro;
  }
  return dados;
}

// Impede que texto escrito pelo utilizador seja interpretado como HTML
function escapar(texto) {
  const substituicoes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(texto ?? '').replace(/[&<>"']/g, (c) => substituicoes[c]);
}

function mostrarErros(elemento, mensagens) {
  elemento.innerHTML = `<ul>${mensagens.map((m) => `<li>${escapar(m)}</li>`).join('')}</ul>`;
  elemento.hidden = false;
}

function limparErros(elemento) {
  elemento.hidden = true;
  elemento.innerHTML = '';
}

// '2026-10-27' -> '27/10/2026'
function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Data de hoje no formato AAAA-MM-DD (hora local)
function dataDeHoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
