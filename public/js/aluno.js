// Ficha do aluno: dados, formulário de nova ocorrência e histórico.
const alunoId = new URLSearchParams(window.location.search).get('id');

const caixaErros = document.getElementById('erros');
const caixaErrosForm = document.getElementById('erros-form');
const formulario = document.getElementById('formulario');
const botao = formulario.querySelector('button');
const campoCategoria = document.getElementById('categoria');
const campoFuncionario = document.getElementById('funcionario');
const campoData = document.getElementById('data');
const listaOcorrencias = document.getElementById('ocorrencias');
const semOcorrencias = document.getElementById('sem-ocorrencias');
const total = document.getElementById('total');

async function carregarAluno() {
  const aluno = await pedirApi(`/api/alunos/${alunoId}`);

  document.title = `${aluno.nome} · Ocorrências Escolares`;
  document.getElementById('aluno-nome').textContent = aluno.nome;
  document.getElementById('aluno-matricula').textContent = aluno.numero_matricula;
  document.getElementById('aluno-turma').textContent = `${aluno.classe}.ª classe, turma ${aluno.turma}`;
  document.getElementById('aluno-encarregado').textContent = aluno.nome_encarregado || 'Não indicado';
  document.getElementById('aluno-contacto').textContent = aluno.contacto_encarregado;
  document.getElementById('ficha').hidden = false;
}

// Preenche as listas do formulário (categorias e funcionários)
async function carregarFormulario() {
  const [categorias, funcionarios] = await Promise.all([
    pedirApi('/api/ocorrencias/categorias'),
    pedirApi('/api/funcionarios'),
  ]);

  campoCategoria.innerHTML = categorias.map((c) => `<option>${escapar(c)}</option>`).join('');
  campoFuncionario.innerHTML =
    '<option value="">Escolha o funcionário</option>' +
    funcionarios
      .map((f) => `<option value="${f.id}">${escapar(f.nome)} (${escapar(f.funcao)})</option>`)
      .join('');

  campoData.value = dataDeHoje();
  campoData.max = dataDeHoje();
  document.getElementById('nova').hidden = false;
}

async function carregarOcorrencias() {
  const ocorrencias = await pedirApi(`/api/ocorrencias?aluno_id=${alunoId}`);

  listaOcorrencias.innerHTML = ocorrencias
    .map(
      (o) => `
      <li>
        <div class="topo-registo">
          <span>${escapar(o.categoria)}</span>
          <time datetime="${escapar(o.data_ocorrencia)}">${formatarData(o.data_ocorrencia)}</time>
        </div>
        <p>${escapar(o.descricao)}</p>
        ${o.observacao ? `<p class="obs">Observação: ${escapar(o.observacao)}</p>` : ''}
        <small>Registada por ${escapar(o.funcionario_nome)} (${escapar(o.funcionario_funcao)})</small>
      </li>`
    )
    .join('');

  total.textContent = `(${ocorrencias.length})`;
  listaOcorrencias.hidden = ocorrencias.length === 0;
  semOcorrencias.hidden = ocorrencias.length > 0;
  document.getElementById('historico').hidden = false;
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparErros(caixaErrosForm);
  botao.disabled = true;

  const dados = Object.fromEntries(new FormData(formulario));
  dados.aluno_id = alunoId;

  try {
    await pedirApi('/api/ocorrencias', { method: 'POST', body: JSON.stringify(dados) });
    formulario.reset();
    campoData.value = dataDeHoje();
    await carregarOcorrencias();
  } catch (erro) {
    mostrarErros(caixaErrosForm, erro.mensagens || ['Não foi possível guardar a ocorrência.']);
  } finally {
    botao.disabled = false;
  }
});

async function iniciar() {
  if (!alunoId) {
    mostrarErros(caixaErros, ['Aluno não indicado. Volte à lista e escolha um aluno.']);
    return;
  }
  try {
    await carregarAluno();
    await Promise.all([carregarFormulario(), carregarOcorrencias()]);
  } catch (erro) {
    mostrarErros(caixaErros, erro.mensagens || ['Não foi possível carregar os dados.']);
  }
}

iniciar();
