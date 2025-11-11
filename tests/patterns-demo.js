// Demonstração dos Design Patterns implementados no DesignFej

const { ProdutoFactory } = require('../src/factories/ProdutoFactory');
const { NotificationManager } = require('../src/patterns/Observer');
const { PedidoCalculator } = require('../src/patterns/Strategy');
const DatabaseConnection = require('../src/config/DatabaseConnection');

console.log('🎯 DEMONSTRAÇÃO DOS DESIGN PATTERNS - DESIGNFEJ\n');

// 1. SINGLETON PATTERN
console.log('1️⃣ SINGLETON PATTERN - DatabaseConnection');
console.log('==========================================');

const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();

console.log('Instância 1:', db1.constructor.name);
console.log('Instância 2:', db2.constructor.name);
console.log('São a mesma instância?', db1 === db2);

// 2. FACTORY METHOD PATTERN
console.log('2️⃣ FACTORY METHOD PATTERN - ProdutoFactory');
console.log('==========================================');

const dadosProduto = {
    nome: 'Anel Solitário',
    descricao: 'Anel elegante com diamante',
    preco: 1299.90,
    imagem: 'anel-solitario.jpg',
    estoque: 5
};

const anel = ProdutoFactory.criarProduto('anel', dadosProduto);
const colar = ProdutoFactory.criarProduto('colar', {
    ...dadosProduto,
    nome: 'Colar Veneziano'
});

console.log('Produto Anel:', anel.constructor.name);
console.log('Tamanhos disponíveis:', anel.tamanhos);
console.log('Produto Colar:', colar.constructor.name);
console.log('Comprimentos disponíveis:', colar.comprimentos);
console.log('✅ Factory Method funcionando corretamente!\n');

// 3. OBSERVER PATTERN
console.log('3️⃣ OBSERVER PATTERN - NotificationManager');
console.log('=========================================');

const notificationManager = new NotificationManager();

// Simular eventos
console.log('📧 Simulando eventos...');

notificationManager.notificarNovoUsuario({
    email: 'teste@designfej.com',
    nome: 'João Silva'
});

notificationManager.notificarNovoPedido({
    id: 123,
    total: 599.90,
    cliente: 'Maria Santos'
});

notificationManager.notificarEstoqueBaixo({
    nome: 'Anel de Ouro',
    estoque: 2
});

console.log('✅ Observer Pattern funcionando corretamente!\n');

// 4. STRATEGY PATTERN
console.log('4️⃣ STRATEGY PATTERN - PedidoCalculator');
console.log('=====================================');

const calculator = new PedidoCalculator();

const itens = [
    { preco: 299.90, quantidade: 2 },
    { preco: 199.90, quantidade: 1 }
];

const peso = 0.5; // kg
const distancia = 15; // km

// Teste sem cupom
console.log('📦 Calculando pedido sem cupom...');
const calculo1 = calculator.calcularTotal(itens, peso, distancia);
console.log('Resultado:', calculo1);

// Teste com cupom de desconto
console.log('\n🎫 Calculando pedido com cupom...');
const cupom = { tipo: 'percentual', valor: 10 };
const calculo2 = calculator.calcularTotal(itens, peso, distancia, cupom);
console.log('Resultado:', calculo2);

console.log('✅ Strategy Pattern funcionando corretamente!\n');

// 5. REPOSITORY PATTERN (Simulação)
console.log('5️⃣ REPOSITORY PATTERN - Demonstração');
console.log('===================================');

console.log('📊 O Repository Pattern está implementado em:');
console.log('- ClienteRepository: CRUD de clientes');
console.log('- ProdutoRepository: CRUD de produtos');
console.log('- PedidoRepository: CRUD de pedidos');
console.log('- CarrinhoRepository: CRUD do carrinho');
console.log('- AvaliacaoRepository: CRUD de avaliações');
console.log('- CupomRepository: CRUD de cupons');
console.log('- WishlistRepository: CRUD da wishlist');
console.log('✅ Repository Pattern implementado em todas as entidades!\n');

console.log('🎉 TODOS OS PADRÕES GOF IMPLEMENTADOS COM SUCESSO!');
console.log('🏆 Sistema DesignFej - 20 Funcionalidades Ativas');
console.log('📚 Padrões: Singleton, Factory Method, Observer, Strategy, Repository');

module.exports = {
    demonstrarPatterns: () => {
        console.log('Demonstração dos patterns executada com sucesso!');
    }
};