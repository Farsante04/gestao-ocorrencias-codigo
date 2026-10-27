// Valida os dados de uma ocorrência antes de guardar.
const CATEGORIAS = ['Atraso', 'Falta de respeito', 'Incumprimento das regras', 'Outro'];

// Data de hoje no formato AAAA-MM-DD (hora local)
function dataDeHoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Confirma que o texto é uma data real (rejeita, por exemplo, 2026-02-31)
function dataValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const data = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === texto;
}

function validarOcorrencia(corpo = {}) {
  const erros = [];
  const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

  const dados = {
    aluno_id: Number(corpo.aluno_id),
    funcionario_id: Number(corpo.funcionario_id),
    categoria: texto(corpo.categoria),
    descricao: texto(corpo.descricao),
    data_ocorrencia: texto(corpo.data_ocorrencia),
    observacao: texto(corpo.observacao),
  };

  if (!Number.isInteger(dados.aluno_id) || dados.aluno_id < 1) {
    erros.push('Aluno inválido.');
  }
  if (!Number.isInteger(dados.funcionario_id) || dados.funcionario_id < 1) {
    erros.push('Escolha o funcionário responsável pelo registo.');
  }
  if (!CATEGORIAS.includes(dados.categoria)) {
    erros.push('Escolha uma categoria da lista.');
  }
  if (dados.descricao.length < 10) {
    erros.push('A descrição deve ter pelo menos 10 caracteres.');
  }
  if (!dataValida(dados.data_ocorrencia)) {
    erros.push('Indique uma data válida.');
  } else if (dados.data_ocorrencia > dataDeHoje()) {
    erros.push('A data da ocorrência não pode ser futura.');
  }

  return { erros, dados };
}

module.exports = { validarOcorrencia, CATEGORIAS };
