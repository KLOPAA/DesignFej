const express = require('express');
const wishlistController = require('../controllers/WishlistController');

const router = express.Router();

// Adicionar produto à wishlist
router.post('/', wishlistController.adicionar.bind(wishlistController));

// Buscar wishlist por cliente
router.get('/cliente/:cliente_id', wishlistController.buscarPorCliente.bind(wishlistController));

// Verificar se produto existe na wishlist
router.get('/cliente/:cliente_id/produto/:produto_id', wishlistController.verificarExiste.bind(wishlistController));

// Contar itens na wishlist
router.get('/cliente/:cliente_id/count', wishlistController.contarItens.bind(wishlistController));

// Remover produto da wishlist
router.delete('/cliente/:cliente_id/produto/:produto_id', wishlistController.remover.bind(wishlistController));

module.exports = router;