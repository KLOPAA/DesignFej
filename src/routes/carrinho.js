const express = require('express');
const router = express.Router();
const path = require('path');
const carrinhoController = require('../controllers/CarrinhoController');

// Rota para servir a página do carrinho
router.get('/carrinho', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/carrinho.html'));
});

// Rotas da API do carrinho
router.post('/api/carrinho/adicionar', carrinhoController.adicionarItem);
router.get('/api/carrinho', carrinhoController.obterCarrinho);
router.put('/api/carrinho/atualizar/:id', carrinhoController.atualizarQuantidade);
router.delete('/api/carrinho/remover/:id', carrinhoController.removerItem);
router.delete('/api/carrinho/limpar', carrinhoController.limparCarrinho);
router.get('/api/carrinho/resumo', carrinhoController.obterResumo);
router.post('/api/carrinho/finalizar', carrinhoController.finalizarCompra);

module.exports = router;