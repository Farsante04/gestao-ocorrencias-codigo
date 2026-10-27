const express = require('express');
const controller = require('../controllers/ocorrencias.controller');

const router = express.Router();

router.get('/categorias', controller.listarCategorias); // GET  /api/ocorrencias/categorias
router.get('/', controller.listarPorAluno);             // GET  /api/ocorrencias?aluno_id=1
router.post('/', controller.criar);                     // POST /api/ocorrencias

module.exports = router;
