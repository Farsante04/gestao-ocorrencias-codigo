const express = require('express');
const controller = require('../controllers/alunos.controller');

const router = express.Router();

router.get('/', controller.listar);   // GET  /api/alunos?pesquisa=ana
router.get('/:id', controller.obter); // GET  /api/alunos/1
router.post('/', controller.criar);   // POST /api/alunos

module.exports = router;
