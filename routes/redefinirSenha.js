const express = require('express');
const router = express.Router();
const db = require('../db.js');


router.post('/verificar-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ existe: false, erro: "E-mail não enviado." });
  }

  db.query('SELECT * FROM cadastro WHERE email = ?', [email], (erro, resultados) => {
    if (erro) {
      console.error('Erro no banco:', erro);
      return res.status(500).json({ existe: false, erro: 'Erro no servidor.' });
    }

    if (resultados.length > 0) {
      res.json({ existe: true });
    } else {
      res.json({ existe: false });
    }
  });
});


router.post("/nova-senha", (req, res) => {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ sucesso: false, mensagem: "Dados incompletos." });
  }

  db.query("UPDATE cadastro SET senha_hash = ? WHERE email = ?", [novaSenha, email], (erro, resultado) => {
    if (erro) {
      console.error("Erro no banco:", erro);
      return res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
    }

    if (resultado.affectedRows > 0) {
      res.json({ sucesso: true, mensagem: "Senha atualizada com sucesso." });
    } else {
      res.json({ sucesso: false, mensagem: "E-mail não encontrado." });
    }
  });
});

module.exports = router;
