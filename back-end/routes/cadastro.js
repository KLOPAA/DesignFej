const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db.js');

// Rota de cadastro
router.post('/', (req, res) => {
  const { nome, email, senha, endereco } = req.body;

  console.log('[POST /cadastro] Dados recebidos:', req.body);

  if (!nome || !email || !senha || !endereco) {
    console.log('[ERRO] Campo obrigatório faltando');
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  const checkSql = 'SELECT id FROM cadastro WHERE email = ?';
  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error('[ERRO] Erro ao verificar e-mail:', err.message);
      return res.status(500).json({ erro: 'Erro ao verificar e-mail.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ erro: 'Email já cadastrado.' });
    }

    bcrypt.hash(senha, 10, (err, senhaHash) => {
      if (err) {
        console.error('[ERRO] Erro ao criptografar senha:', err.message);
        return res.status(500).json({ erro: 'Erro ao processar senha.' });
      }

      const insertSql = 'INSERT INTO cadastro (nome, email, senha_hash, endereco) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [nome, email, senhaHash, endereco], (err, result) => {
        if (err) {
          console.error('[ERRO] Erro ao inserir no banco:', err.message);
          return res.status(500).json({ erro: 'Erro ao cadastrar.' });
        }

        console.log('[SUCESSO] Usuário cadastrado com sucesso! ID:', result.insertId);
        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
      });
    });
  });
});

module.exports = router;