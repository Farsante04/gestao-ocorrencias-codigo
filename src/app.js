// Configuração do Express: middlewares e rotas.
const express = require('express');
const path = require('path');

const alunosRoutes = require('./routes/alunos.routes');
const funcionariosRoutes = require('./routes/funcionarios.routes');
const ocorrenciasRoutes = require('./routes/ocorrencias.routes');

const app = express();

// Permite ler JSON enviado no corpo dos pedidos
app.use(express.json());

// Serve as páginas da pasta public (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'public')));

// API
app.use('/api/alunos', alunosRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/ocorrencias', ocorrenciasRoutes);

// Endereço da API que não existe
app.use('/api', (req, res) => {
  res.status(404).json({ erros: ['Endereço não encontrado.'] });
});

// Erros inesperados (o Express reconhece este middleware pelos 4 parâmetros)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erros: ['JSON inválido.'] });
  }
  console.error(err);
  res.status(500).json({ erros: ['Erro interno do servidor.'] });
});

module.exports = app;
