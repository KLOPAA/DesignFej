const express = require('express');
const relatorioController = require('../controllers/RelatorioController');

const router = express.Router();

// Dashboard principal
router.get('/dashboard', relatorioController.dashboard.bind(relatorioController));

// Relatório de vendas
router.get('/vendas', relatorioController.vendas.bind(relatorioController));

// Produtos mais vendidos
router.get('/produtos-mais-vendidos', relatorioController.produtosMaisVendidos.bind(relatorioController));

// Clientes mais ativos
router.get('/clientes-ativos', relatorioController.clientesAtivos.bind(relatorioController));

// Relatório de estoque
router.get('/estoque', relatorioController.estoque.bind(relatorioController));

module.exports = router;