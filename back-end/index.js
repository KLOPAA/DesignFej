const express = require('express');
const cadastroRouter = require('./routes/cadastro');
const loginRoute = require('./routes/login');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// Rotas
app.use('/cadastro', cadastroRouter);
app.use('/login', loginRoute);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});



