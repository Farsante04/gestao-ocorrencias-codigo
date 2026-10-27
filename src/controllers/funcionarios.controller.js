const db = require('../database/db');

// GET /api/funcionarios
// Usada para preencher a lista "Funcionário responsável" no formulário.
function listar(req, res) {
  const funcionarios = db
    .prepare('SELECT id, nome, funcao FROM funcionarios ORDER BY nome')
    .all();

  res.json(funcionarios);
}

module.exports = { listar };
