-- Estrutura da base de dados (Etapa 2).
-- "IF NOT EXISTS" permite executar este ficheiro sempre que o servidor arranca
-- sem apagar nem duplicar nada.

CREATE TABLE IF NOT EXISTS alunos (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_matricula     TEXT    NOT NULL UNIQUE,
  nome                 TEXT    NOT NULL,
  classe               INTEGER NOT NULL CHECK (classe BETWEEN 1 AND 13),
  turma                TEXT    NOT NULL,
  nome_encarregado     TEXT,
  contacto_encarregado TEXT    NOT NULL,
  criado_em            TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS funcionarios (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  nome   TEXT NOT NULL,
  email  TEXT NOT NULL UNIQUE,
  funcao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ocorrencias (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  aluno_id        INTEGER NOT NULL REFERENCES alunos (id),
  funcionario_id  INTEGER NOT NULL REFERENCES funcionarios (id),
  categoria       TEXT    NOT NULL CHECK (categoria IN
                    ('Atraso', 'Falta de respeito', 'Incumprimento das regras', 'Outro')),
  descricao       TEXT    NOT NULL,
  data_ocorrencia TEXT    NOT NULL, -- formato AAAA-MM-DD
  observacao      TEXT,
  criado_em       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Acelera a consulta das ocorrências de um aluno
CREATE INDEX IF NOT EXISTS idx_ocorrencias_aluno
  ON ocorrencias (aluno_id, data_ocorrencia);
