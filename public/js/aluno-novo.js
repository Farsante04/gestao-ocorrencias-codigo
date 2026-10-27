// Página "Novo aluno": envia o formulário para a API.
const formulario = document.getElementById('formulario');
const caixaErros = document.getElementById('erros');
const botao = formulario.querySelector('button');

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparErros(caixaErros);
  botao.disabled = true;

  const dados = Object.fromEntries(new FormData(formulario));

  try {
    const aluno = await pedirApi('/api/alunos', { method: 'POST', body: JSON.stringify(dados) });
    window.location.href = `aluno.html?id=${aluno.id}`; // abre a ficha do aluno criado
  } catch (erro) {
    mostrarErros(caixaErros, erro.mensagens || ['Não foi possível guardar o aluno.']);
    botao.disabled = false;
  }
});
