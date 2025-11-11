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

<<<<<<< HEAD
// Listar todos os cupons
router.get('/todos', cupomController.listarTodos.bind(cupomController));

=======
>>>>>>> edb44139fc1678797acca79fc165df932d43a4c2
// Desativar cupom
router.put('/:id/desativar', cupomController.desativar.bind(cupomController));

module.exports = router;