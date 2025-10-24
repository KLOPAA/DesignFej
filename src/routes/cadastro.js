const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');

// rota de cadastro
router.post('/', clienteController.cadastrar);

// rotas adicionais para CRUD de clientes
router.get('/', clienteController.listarTodos);
router.get('/:id', clienteController.buscarPorId);
router.put('/:id', clienteController.atualizar);
router.delete('/:id', clienteController.excluir);

module.exports = router;