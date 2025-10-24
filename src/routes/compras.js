const express = require('express');
const router = express.Router();
const CompraController = require('../controllers/CompraController');

const compraController = new CompraController();

// Rota para finalizar compra
router.post('/finalizar', async (req, res) => {
    await compraController.finalizarCompra(req, res);
});

module.exports = router;