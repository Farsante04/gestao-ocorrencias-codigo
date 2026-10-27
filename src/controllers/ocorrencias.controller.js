const db = require('../database/db');
const { validarOcorrencia, CATEGORIAS } = require('../validators/ocorrencia.validator');

// GET /api/ocorrencias/categorias
function listarCategorias(req, res) {
  res.json(CATEGORIAS);
}

// GET /api/ocorrencias?aluno_id=1
// Ocorrências de um aluno, das mais recentes para as mais antigas.
function listarPorAluno(req, res) {
  const alunoId = Number(req.query.aluno_id);
  if (!Number.isInteger(alunoId) || alunoId < 1) {
    return res.status(400).json({ erros: ['Indique o aluno (aluno_id).'] });
  }

  const ocorrencias = db
    .prepare(
      `SELECT o.id, o.categoria, o.descricao, o.data_ocorrencia, o.observacao,
              f.nome AS funcionario_nome, f.funcao AS funcionario_funcao
       FROM ocorrencias o
       JOIN funcionarios f ON f.id = o.funcionario_id
       WHERE o.aluno_id = ?
       ORDER BY o.data_ocorrencia DESC, o.id DESC`
    )
    .all(alunoId);

  res.json(ocorrencias);
}

// POST /api/ocorrencias
function criar(req, res) {
  const { erros, dados } = validarOcorrencia(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  // O aluno e o funcionário têm de existir
  const aluno = db.prepare('SELECT id FROM alunos WHERE id = ?').get(dados.aluno_id);
  if (!aluno) {
    return res.status(404).json({ erros: ['Aluno não encontrado.'] });
  }
  const funcionario = db.prepare('SELECT id FROM funcionarios WHERE id = ?').get(dados.funcionario_id);
  if (!funcionario) {
    return res.status(400).json({ erros: ['Funcionário não encontrado.'] });
  }

  const resultado = db
    .prepare(
      `INSERT INTO ocorrencias (aluno_id, funcionario_id, categoria, descricao, data_ocorrencia, observacao)
       VALUES (@aluno_id, @funcionario_id, @categoria, @descricao, @data_ocorrencia, @observacao)`
    )
    .run(dados);

  res.status(201).json({ id: Number(resultado.lastInsertRowid) });
}

module.exports = { listarCategorias, listarPorAluno, criar };
