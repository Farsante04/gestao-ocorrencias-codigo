// Ligação à base de dados SQLite.
// Na primeira execução cria o ficheiro, as tabelas e os funcionários iniciais.
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const pastaDados = path.join(__dirname, '..', '..', 'data');
const ficheiroBd = path.join(pastaDados, 'ocorrencias.sqlite');

// Garante que a pasta "data" existe
fs.mkdirSync(pastaDados, { recursive: true });

const db = new Database(ficheiroBd);

// O SQLite só respeita as chaves estrangeiras se isto estiver ligado
db.pragma('foreign_keys = ON');

// Cria as tabelas (se ainda não existirem)
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

// Insere os funcionários iniciais apenas se a tabela estiver vazia
const { total } = db.prepare('SELECT COUNT(*) AS total FROM funcionarios').get();
if (total === 0) {
  db.exec(fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8'));
}

module.exports = db;
