const express = require('express');
const avaliacaoController = require('../controllers/AvaliacaoController');

const router = express.Router();

// Criar nova avaliação
router.post('/', avaliacaoController.criar.bind(avaliacaoController));

// Buscar avaliações por produto
router.get('/produto/:produto_id', avaliacaoController.buscarPorProduto.bind(avaliacaoController));

// Obter estatísticas de avaliação de um produto
router.get('/produto/:produto_id/estatisticas', avaliacaoController.obterEstatisticas.bind(avaliacaoController));

// Listar todas as avaliações
router.get('/', avaliacaoController.listarTodas.bind(avaliacaoController));

module.exports = router;