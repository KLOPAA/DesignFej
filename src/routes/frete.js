const express = require('express');
const router = express.Router();
const FreteController = require('../controllers/FreteController');

router.post('/calcular', FreteController.calcular);

module.exports = router;