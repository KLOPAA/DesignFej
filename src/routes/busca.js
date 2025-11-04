const express = require('express');
const buscaController = require('../controllers/BuscaController');

const router = express.Router();

// Buscar produtos com filtros
router.get('/produtos', buscaController.buscarProdutos.bind(buscaController));

// Obter categorias disponíveis
router.get('/categorias', buscaController.obterCategorias.bind(buscaController));

// Sugestões de busca
router.get('/sugestoes', buscaController.sugestoesBusca.bind(buscaController));

// Produtos mais vistos
router.get('/mais-vistos', buscaController.produtosMaisVistos.bind(buscaController));

// Produtos recomendados para um cliente
router.get('/recomendados/:cliente_id', buscaController.produtosRecomendados.bind(buscaController));

module.exports = router;