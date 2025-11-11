const express = require('express');
const router = express.Router();
const EstoqueController = require('../controllers/EstoqueController');

const estoqueController = new EstoqueController();

// Obter todo o estoque
router.get('/', async (req, res) => {
    await estoqueController.obterEstoque(req, res);
});

// Verificar produtos com estoque baixo
router.get('/baixo', async (req, res) => {
    await estoqueController.verificarEstoqueBaixo(req, res);
});

// Atualizar estoque de um produto
router.put('/:id', async (req, res) => {
    await estoqueController.atualizarEstoque(req, res);
});

// Adicionar estoque
router.post('/:id/adicionar', async (req, res) => {
    await estoqueController.adicionarEstoque(req, res);
});

// Remover estoque
router.post('/:id/remover', async (req, res) => {
    await estoqueController.removerEstoque(req, res);
});

// Histórico de movimentação
router.get('/historico', async (req, res) => {
    await estoqueController.obterHistoricoMovimentacao(req, res);
});

module.exports = router;