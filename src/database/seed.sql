-- Dados iniciais: funcionários de exemplo.
-- Só é executado quando a tabela "funcionarios" está vazia.
-- Altera os nomes e emails para os dados reais da escola.

INSERT INTO funcionarios (nome, email, funcao) VALUES
  ('Maria Fernanda Silva', 'maria.silva@escola.example',  'Professora'),
  ('João Baptista Neto',   'joao.neto@escola.example',    'Director de turma'),
  ('Teresa Gomes',         'teresa.gomes@escola.example', 'Secretaria');
