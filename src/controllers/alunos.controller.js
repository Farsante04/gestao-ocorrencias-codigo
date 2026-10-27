const db = require('../database/db');
const { validarAluno } = require('../validators/aluno.validator');

// GET /api/alunos?pesquisa=texto
// Lista os alunos; se houver "pesquisa", filtra por nome ou matrícula.
function listar(req, res) {
  const pesquisa = String(req.query.pesquisa || '').trim();
  const termo = `%${pesquisa}%`;

  const alunos = db
    .prepare(
      `SELECT a.*,
              (SELECT COUNT(*) FROM ocorrencias o WHERE o.aluno_id = a.id) AS total_ocorrencias
       FROM alunos a
       WHERE a.nome LIKE ? OR a.numero_matricula LIKE ?
       ORDER BY a.nome`
    )
    .all(termo, termo);

  res.json(alunos);
}

// GET /api/alunos/:id
function obter(req, res) {
  const id = Number(req.params.id);
  const aluno = Number.isInteger(id)
    ? db.prepare('SELECT * FROM alunos WHERE id = ?').get(id)
    : undefined;

  if (!aluno) {
    return res.status(404).json({ erros: ['Aluno não encontrado.'] });
  }
  res.json(aluno);
}

// POST /api/alunos
function criar(req, res) {
  const { erros, dados } = validarAluno(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  const existente = db
    .prepare('SELECT id FROM alunos WHERE numero_matricula = ?')
    .get(dados.numero_matricula);
  if (existente) {
    return res.status(409).json({ erros: ['Já existe um aluno com este número de matrícula.'] });
  }

  const resultado = db
    .prepare(
      `INSERT INTO alunos (numero_matricula, nome, classe, turma, nome_encarregado, contacto_encarregado)
       VALUES (@numero_matricula, @nome, @classe, @turma, @nome_encarregado, @contacto_encarregado)`
    )
    .run(dados);

  const aluno = db.prepare('SELECT * FROM alunos WHERE id = ?').get(resultado.lastInsertRowid);
  res.status(201).json(aluno);
}

module.exports = { listar, obter, criar };
