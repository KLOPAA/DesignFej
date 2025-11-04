const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/PedidoController');

// Rotas CRUD para pedidos
router.post('/', pedidoController.criar);
router.post('/calcular', pedidoController.calcularPedido);
router.get('/', pedidoController.listarTodos);
router.get('/buscar-sessao', pedidoController.buscarPorSessao);
router.get('/buscar-status', pedidoController.buscarPorStatus);
router.get('/estatisticas', pedidoController.obterEstatisticas);
router.get('/:id', pedidoController.buscarPorId);
router.patch('/:id/status', pedidoController.atualizarStatus);
router.delete('/:id', pedidoController.excluir);

module.exports = router;