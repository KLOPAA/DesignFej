const express = require('express');
const path = require('path'); 
const DatabaseConnection = require('./src/config/DatabaseConnection');
const { NotificationManager } = require('./src/patterns/Observer');
const BackupService = require('./src/services/BackupService');

// Importar rotas
const cadastroRouter = require('./src/routes/cadastro');
const loginRouter = require('./src/routes/login');
const redefinirSenhaRouter = require('./src/routes/redefinirSenha'); 
const avaliacoesRouter = require('./src/routes/avaliacoes');
const cuponsRouter = require('./src/routes/cupons');
const produtosRouter = require('./src/routes/produtos');
const comprasRouter = require('./src/routes/compras');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota inicial -> login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

// Rotas para servir páginas HTML
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

app.get('/cadastro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'cadastro.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/carrinho.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'carrinho.html'));
});

app.get('/redefinirSenha.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'redefinirSenha.html'));
});

app.get('/definirNovaSenha.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'definirNovaSenha.html'));
});

app.get('/cupons.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'cupons.html'));
});

app.get('/wishlist.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'wishlist.html'));
});

app.get('/avaliacoes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'avaliacoes.html'));
});

app.get('/perfil.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'perfil.html'));
});

app.get('/alianca.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'alianca.html'));
});

app.get('/brinco.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'brinco.html'));
});

app.get('/colares.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'colares.html'));
});

app.get('/pingentes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'pingentes.html'));
});

app.get('/posCompra.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'posCompra.html'));
});

app.get('/meusPedidos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'meusPedidos.html'));
});

// Rotas da API
app.use('/cadastro', cadastroRouter);
app.use('/login', loginRouter);
app.use('/redefinir', redefinirSenhaRouter); 
app.use('/api/avaliacoes', avaliacoesRouter);
app.use('/api/cupons', cuponsRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/compras', comprasRouter);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('[ERRO]', err.stack);
    res.status(500).json({ erro: 'Erro interno do servidor' });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

// Inicializar conexão com banco usando Singleton
async function iniciarServidor() {
    try {
        const db = DatabaseConnection.getInstance();
        await db.connect();
        
        // Inicializar sistema de notificações
        const notificationManager = new NotificationManager();
        app.locals.notificationManager = notificationManager;
        
        // Inicializar serviço de backup automático
        const backupService = new BackupService();
        backupService.agendarBackupAutomatico();
        app.locals.backupService = backupService;
        
        app.listen(PORT, () => {
            console.log('📊 Sistema de Joalheria - DesignFej');
            console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error.message);
        process.exit(1);
    }
}

iniciarServidor();

module.exports = app;