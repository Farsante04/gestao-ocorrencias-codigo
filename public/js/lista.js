// Página inicial: lista e pesquisa de alunos.
const campoPesquisa = document.getElementById('pesquisa');
const lista = document.getElementById('lista');
const vazio = document.getElementById('vazio');
const caixaErros = document.getElementById('erros');

async function carregarAlunos() {
  try {
    limparErros(caixaErros);
    const pesquisa = encodeURIComponent(campoPesquisa.value.trim());
    const alunos = await pedirApi(`/api/alunos?pesquisa=${pesquisa}`);

    lista.innerHTML = alunos
      .map(
        (a) => `
        <tr>
          <td>${escapar(a.numero_matricula)}</td>
          <td>${escapar(a.nome)}</td>
          <td>${a.classe}.ª</td>
          <td>${escapar(a.turma)}</td>
          <td>${a.total_ocorrencias}</td>
          <td><a href="aluno.html?id=${a.id}">Ver ficha</a></td>
        </tr>`
      )
      .join('');
    vazio.hidden = alunos.length > 0;
  } catch (erro) {
    mostrarErros(caixaErros, erro.mensagens || ['Não foi possível carregar os alunos.']);
  }
}

// Pesquisa enquanto o utilizador escreve (com uma pequena pausa)
let temporizador;
campoPesquisa.addEventListener('input', () => {
  clearTimeout(temporizador);
  temporizador = setTimeout(carregarAlunos, 300);
});

carregarAlunos();
