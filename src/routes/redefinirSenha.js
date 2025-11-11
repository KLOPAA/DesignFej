const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');

// Rota para verificar se o email existe
router.post('/verificar-email', clienteController.verificarEmail);

// Rota para definir nova senha
router.post('/definirNovaSenha', clienteController.definirNovaSenha);
router.post('/nova-senha', clienteController.definirNovaSenha);

module.exports = router;