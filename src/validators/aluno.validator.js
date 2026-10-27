// Valida os dados de um aluno antes de guardar.
// Devolve { erros, dados }:
//  - erros: lista de mensagens (vazia se estiver tudo certo)
//  - dados: valores já limpos (sem espaços a mais)
function validarAluno(corpo = {}) {
  const erros = [];
  const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

  const dados = {
    numero_matricula: texto(corpo.numero_matricula),
    nome: texto(corpo.nome),
    classe: Number(corpo.classe),
    turma: texto(corpo.turma).toUpperCase(),
    nome_encarregado: texto(corpo.nome_encarregado),
    contacto_encarregado: texto(corpo.contacto_encarregado).replace(/\s+/g, ''),
  };

  if (!/^[A-Za-z0-9-]{3,20}$/.test(dados.numero_matricula)) {
    erros.push('O número de matrícula deve ter entre 3 e 20 caracteres (letras, números ou hífen).');
  }
  if (dados.nome.length < 3 || dados.nome.length > 100) {
    erros.push('O nome deve ter entre 3 e 100 caracteres.');
  }
  if (!Number.isInteger(dados.classe) || dados.classe < 1 || dados.classe > 13) {
    erros.push('A classe deve ser um número entre 1 e 13.');
  }
  if (dados.turma.length < 1 || dados.turma.length > 10) {
    erros.push('Indique a turma (até 10 caracteres).');
  }
  if (dados.nome_encarregado.length > 100) {
    erros.push('O nome do encarregado não pode ter mais de 100 caracteres.');
  }
  // Aceita 9 dígitos a começar por 9, com ou sem o prefixo +244
  if (!/^(\+?244)?9\d{8}$/.test(dados.contacto_encarregado)) {
    erros.push('O contacto do encarregado é inválido. Use 9 dígitos a começar por 9 (ex.: 923456789).');
  }

  return { erros, dados };
}

module.exports = { validarAluno };
