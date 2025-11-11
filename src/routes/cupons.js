const express = require('express');
const cupomController = require('../controllers/CupomController');

const router = express.Router();

// Criar novo cupom
router.post('/', cupomController.criar.bind(cupomController));

// Validar cupom
router.post('/validar', cupomController.validar.bind(cupomController));

// Usar cupom
router.post('/usar', cupomController.usar.bind(cupomController));

// Listar cupons ativos
router.get('/ativos', cupomController.listarAtivos.bind(cupomController));

// Listar todos os cupons
router.get('/todos', cupomController.listarTodos.bind(cupomController));

// Desativar cupom
router.put('/:id/desativar', cupomController.desativar.bind(cupomController));

module.exports = router;