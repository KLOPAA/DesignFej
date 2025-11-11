const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/ProdutoController');

// Rotas CRUD para produtos
router.post('/', produtoController.criar);
router.get('/', produtoController.listarTodos);
router.get('/buscar-categoria', produtoController.buscarPorCategoria);
router.get('/buscar-nome', produtoController.buscarPorNome);
router.get('/:id', produtoController.buscarPorId);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.excluir);
router.patch('/:id/estoque', produtoController.atualizarEstoque);

module.exports = router;