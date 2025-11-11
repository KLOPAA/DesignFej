const express = require('express');
const router = express.Router();
const CompraController = require('../controllers/CompraController');

const compraController = new CompraController();

// Rota para finalizar compra
router.post('/finalizar', async (req, res) => {
    await compraController.finalizarCompra(req, res);
});

<<<<<<< HEAD
// Rota para obter pedidos do usuário
router.get('/pedidos', async (req, res) => {
    await compraController.obterPedidosUsuario(req, res);
});

// Rota para atualizar status do pedido
router.put('/pedidos/:id/status', async (req, res) => {
    await compraController.atualizarStatusPedido(req, res);
});

// Rota para rastreamento
router.get('/rastreamento/:codigo', async (req, res) => {
    await compraController.obterRastreamento(req, res);
});

=======
>>>>>>> edb44139fc1678797acca79fc165df932d43a4c2
module.exports = router;