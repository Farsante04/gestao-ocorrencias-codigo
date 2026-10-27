const express = require('express');
const controller = require('../controllers/funcionarios.controller');

const router = express.Router();

router.get('/', controller.listar); // GET /api/funcionarios

module.exports = router;
