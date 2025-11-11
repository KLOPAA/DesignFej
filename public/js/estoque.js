<<<<<<< HEAD
// Controlador do lado cliente para estoque
class EstoqueController {
    constructor() {
        this.produtos = [];
        this.init();
    }

    init() {
        this.carregarEstoque();
    }

    async carregarEstoque() {
        try {
            const response = await fetch('/api/estoque');
            const data = await response.json();
            
            if (data.success) {
                this.produtos = data.produtos;
                this.renderizarEstoque();
            } else {
                console.error('Erro ao carregar estoque:', data.message);
                this.mostrarEstoqueEstatico();
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            this.mostrarEstoqueEstatico();
        }
    }

    renderizarEstoque() {
        const container = document.getElementById('estoque-lista');
        if (!container) return;

        if (this.produtos.length === 0) {
            container.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        container.innerHTML = this.produtos.map(produto => {
            const statusEstoque = this.getStatusEstoque(produto.estoque);
            const corStatus = this.getCorStatus(produto.estoque);
            
            return `
                <div class="produto-estoque" data-id="${produto.id}">
                    <div class="produto-info">
                        <img src="${produto.imagem || '/img/produto-default.jpg'}" alt="${produto.nome}" onerror="this.src='/img/produto-default.jpg'">
                        <div class="detalhes">
                            <h4>${produto.nome}</h4>
                            <p class="categoria">${produto.categoria}</p>
                            <p class="preco">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="estoque-info">
                        <div class="estoque-atual" style="color: ${corStatus}">
                            <span class="numero">${produto.estoque}</span>
                            <span class="status">${statusEstoque}</span>
                        </div>
                        <div class="acoes-estoque">
                            <button onclick="estoqueController.adicionarEstoque(${produto.id})" class="btn-adicionar">+ Adicionar</button>
                            <button onclick="estoqueController.removerEstoque(${produto.id})" class="btn-remover">- Remover</button>
                            <button onclick="estoqueController.editarEstoque(${produto.id})" class="btn-editar">✏️ Editar</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.atualizarEstatisticas();
    }

    mostrarEstoqueEstatico() {
        // Fallback para dados estáticos caso a API falhe
        this.produtos = [
            { id: 1, nome: 'Brinco de Ouro 18k', categoria: 'Brincos', preco: 289.90, estoque: 15, imagem: '/img/brinco-ouro.jpg' },
            { id: 2, nome: 'Colar de Prata Sterling', categoria: 'Colares', preco: 189.90, estoque: 8, imagem: '/img/colar-prata.jpg' },
            { id: 3, nome: 'Anel com Diamante', categoria: 'Anéis', preco: 459.90, estoque: 3, imagem: '/img/anel-diamante.jpg' },
            { id: 4, nome: 'Pulseira de Ouro', categoria: 'Pulseiras', preco: 350.00, estoque: 12, imagem: '/img/pulseira-ouro.jpg' },
            { id: 5, nome: 'Conjunto Esmeralda', categoria: 'Conjuntos', preco: 890.00, estoque: 5, imagem: '/img/conjunto-esmeralda.jpg' }
        ];
        
        this.renderizarEstoque();
    }

    getStatusEstoque(quantidade) {
        if (quantidade === 0) return 'SEM ESTOQUE';
        if (quantidade <= 3) return 'ESTOQUE BAIXO';
        if (quantidade <= 10) return 'ESTOQUE MÉDIO';
        return 'ESTOQUE BOM';
    }

    getCorStatus(quantidade) {
        if (quantidade === 0) return '#f44336';
        if (quantidade <= 3) return '#ff9800';
        if (quantidade <= 10) return '#2196F3';
        return '#4CAF50';
    }

    async adicionarEstoque(produtoId) {
        const quantidade = prompt('Quantas unidades deseja adicionar?');
        if (!quantidade || isNaN(quantidade) || parseInt(quantidade) <= 0) {
            this.mostrarMensagem('Quantidade inválida', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/estoque/${produtoId}/adicionar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantidade: parseInt(quantidade) })
            });

            const data = await response.json();
            
            if (data.success) {
                this.mostrarMensagem(`${quantidade} unidades adicionadas com sucesso!`, 'success');
                this.carregarEstoque(); // Recarregar dados
            } else {
                this.mostrarMensagem('Erro: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Erro ao adicionar estoque:', error);
            // Fallback para atualização local
            this.atualizarEstoqueLocal(produtoId, parseInt(quantidade), 'adicionar');
        }
    }

    async removerEstoque(produtoId) {
        const produto = this.produtos.find(p => p.id == produtoId);
        if (!produto) return;

        const quantidade = prompt(`Quantas unidades deseja remover?\nEstoque atual: ${produto.estoque}`);
        if (!quantidade || isNaN(quantidade) || parseInt(quantidade) <= 0) {
            this.mostrarMensagem('Quantidade inválida', 'error');
            return;
        }

        if (parseInt(quantidade) > produto.estoque) {
            this.mostrarMensagem('Quantidade maior que o estoque disponível', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/estoque/${produtoId}/remover`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantidade: parseInt(quantidade) })
            });

            const data = await response.json();
            
            if (data.success) {
                this.mostrarMensagem(`${quantidade} unidades removidas com sucesso!`, 'success');
                this.carregarEstoque(); // Recarregar dados
            } else {
                this.mostrarMensagem('Erro: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Erro ao remover estoque:', error);
            // Fallback para atualização local
            this.atualizarEstoqueLocal(produtoId, -parseInt(quantidade), 'remover');
        }
    }

    async editarEstoque(produtoId) {
        const produto = this.produtos.find(p => p.id == produtoId);
        if (!produto) return;

        const novoEstoque = prompt(`Definir novo estoque para "${produto.nome}":\nEstoque atual: ${produto.estoque}`);
        if (novoEstoque === null || isNaN(novoEstoque) || parseInt(novoEstoque) < 0) {
            this.mostrarMensagem('Estoque inválido', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/estoque/${produtoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estoque: parseInt(novoEstoque) })
            });

            const data = await response.json();
            
            if (data.success) {
                this.mostrarMensagem(`Estoque atualizado para ${novoEstoque} unidades!`, 'success');
                this.carregarEstoque(); // Recarregar dados
            } else {
                this.mostrarMensagem('Erro: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Erro ao editar estoque:', error);
            // Fallback para atualização local
            produto.estoque = parseInt(novoEstoque);
            this.renderizarEstoque();
            this.mostrarMensagem(`Estoque atualizado localmente para ${novoEstoque} unidades!`, 'warning');
        }
    }

    atualizarEstoqueLocal(produtoId, quantidade, operacao) {
        const produto = this.produtos.find(p => p.id == produtoId);
        if (!produto) return;

        if (operacao === 'adicionar') {
            produto.estoque += quantidade;
        } else if (operacao === 'remover') {
            produto.estoque = Math.max(0, produto.estoque + quantidade); // quantidade já é negativa
        }

        this.renderizarEstoque();
        this.mostrarMensagem(`Estoque atualizado localmente!`, 'warning');
    }

    async verificarEstoqueBaixo() {
        try {
            const response = await fetch('/api/estoque/baixo?limite=5');
            const data = await response.json();
            
            if (data.success && data.produtos.length > 0) {
                const lista = data.produtos.map(p => `• ${p.nome}: ${p.estoque} unidades`).join('\n');
                alert(`⚠️ Produtos com estoque baixo (≤5 unidades):\n\n${lista}`);
            } else {
                this.mostrarMensagem('✅ Nenhum produto com estoque baixo!', 'success');
            }
        } catch (error) {
            console.error('Erro ao verificar estoque baixo:', error);
            // Fallback local
            const produtosBaixo = this.produtos.filter(p => p.estoque <= 5);
            if (produtosBaixo.length > 0) {
                const lista = produtosBaixo.map(p => `• ${p.nome}: ${p.estoque} unidades`).join('\n');
                alert(`⚠️ Produtos com estoque baixo (≤5 unidades):\n\n${lista}`);
            } else {
                this.mostrarMensagem('✅ Nenhum produto com estoque baixo!', 'success');
            }
        }
    }

    atualizarEstatisticas() {
        const totalProdutos = this.produtos.length;
        const semEstoque = this.produtos.filter(p => p.estoque === 0).length;
        const estoqueBaixo = this.produtos.filter(p => p.estoque > 0 && p.estoque <= 5).length;
        const estoqueTotal = this.produtos.reduce((total, p) => total + p.estoque, 0);

        const estatisticasDiv = document.getElementById('estatisticas-estoque');
        if (estatisticasDiv) {
            estatisticasDiv.innerHTML = `
                <div class="estatistica">
                    <span class="numero">${totalProdutos}</span>
                    <span class="label">Total de Produtos</span>
                </div>
                <div class="estatistica">
                    <span class="numero">${estoqueTotal}</span>
                    <span class="label">Unidades em Estoque</span>
                </div>
                <div class="estatistica">
                    <span class="numero" style="color: #f44336">${semEstoque}</span>
                    <span class="label">Sem Estoque</span>
                </div>
                <div class="estatistica">
                    <span class="numero" style="color: #ff9800">${estoqueBaixo}</span>
                    <span class="label">Estoque Baixo</span>
                </div>
            `;
        }
    }

    filtrarPorCategoria(categoria) {
        const produtosFiltrados = categoria === 'todos' 
            ? this.produtos 
            : this.produtos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());

        const container = document.getElementById('estoque-lista');
        if (!container) return;

        container.innerHTML = produtosFiltrados.map(produto => {
            const statusEstoque = this.getStatusEstoque(produto.estoque);
            const corStatus = this.getCorStatus(produto.estoque);
            
            return `
                <div class="produto-estoque" data-id="${produto.id}">
                    <div class="produto-info">
                        <img src="${produto.imagem || '/img/produto-default.jpg'}" alt="${produto.nome}" onerror="this.src='/img/produto-default.jpg'">
                        <div class="detalhes">
                            <h4>${produto.nome}</h4>
                            <p class="categoria">${produto.categoria}</p>
                            <p class="preco">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="estoque-info">
                        <div class="estoque-atual" style="color: ${corStatus}">
                            <span class="numero">${produto.estoque}</span>
                            <span class="status">${statusEstoque}</span>
                        </div>
                        <div class="acoes-estoque">
                            <button onclick="estoqueController.adicionarEstoque(${produto.id})" class="btn-adicionar">+ Adicionar</button>
                            <button onclick="estoqueController.removerEstoque(${produto.id})" class="btn-remover">- Remover</button>
                            <button onclick="estoqueController.editarEstoque(${produto.id})" class="btn-editar">✏️ Editar</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    mostrarMensagem(mensagem, tipo = 'info') {
        // Criar ou atualizar elemento de mensagem
        let msgElement = document.getElementById('mensagem-temporaria');
        if (!msgElement) {
            msgElement = document.createElement('div');
            msgElement.id = 'mensagem-temporaria';
            msgElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(msgElement);
        }

        // Definir cor baseada no tipo
        const cores = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };

        msgElement.style.backgroundColor = cores[tipo] || cores.info;
        msgElement.textContent = mensagem;
        msgElement.style.opacity = '1';

        // Remover após 3 segundos
        setTimeout(() => {
            msgElement.style.opacity = '0';
            setTimeout(() => {
                if (msgElement.parentNode) {
                    msgElement.parentNode.removeChild(msgElement);
                }
            }, 300);
        }, 3000);
    }
}

// Inicializar controlador quando a página carregar
let estoqueController;
document.addEventListener('DOMContentLoaded', function() {
    estoqueController = new EstoqueController();
=======
// Sistema de controle de estoque no frontend
class EstoqueManager {
    constructor() {
        this.produtos = this.carregarEstoque();
        this.initEventListeners();
    }

    carregarEstoque() {
        // Simula dados de estoque (em produção viria do backend)
        return {
            '1': { nome: 'Brinco de Ouro 18k', estoque: 15 },
            '2': { nome: 'Colar de Prata Sterling', estoque: 8 },
            '3': { nome: 'Anel com Diamante', estoque: 15 },
            '4': { nome: 'Pulseira de Ouro', estoque: 12 },
            '5': { nome: 'Conjunto Esmeralda', estoque: 5 },
            '6': { nome: 'Aliança de Casamento', estoque: 20 },
            '7': { nome: 'Corrente de Ouro 18k', estoque: 7 },
            '8': { nome: 'Brinco com Rubi', estoque: 4 },
            '9': { nome: 'Pingente Aqua', estoque: 10 }
        };
    }

    initEventListeners() {
        // Intercepta cliques nos botões de carrinho
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-carrinho')) {
                const produtoCard = e.target.closest('.produto-card');
                const produtoId = this.extrairProdutoId(e.target.onclick.toString());
                this.processarCompra(produtoId, 1);
            }
        });
    }

    extrairProdutoId(onclickString) {
        const match = onclickString.match(/'(\d+)'/);
        return match ? match[1] : null;
    }

    async processarCompra(produtoId, quantidade) {
        if (!this.produtos[produtoId]) return;

        const produto = this.produtos[produtoId];
        
        if (produto.estoque >= quantidade) {
            produto.estoque -= quantidade;
            this.atualizarEstoqueVisual(produtoId, produto.estoque);
            this.verificarEstoqueBaixo(produtoId, produto);
            this.salvarEstoque();
            
            // Atualizar no banco de dados
            await this.atualizarEstoqueBanco(produtoId, produto.estoque);
        } else {
            alert(`Estoque insuficiente! Apenas ${produto.estoque} unidades disponíveis.`);
        }
    }

    async atualizarEstoqueBanco(produtoId, novoEstoque) {
        try {
            await fetch(`http://localhost:3000/api/produtos/${produtoId}/estoque`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estoque: novoEstoque })
            });
        } catch (error) {
            console.error('Erro ao atualizar estoque no banco:', error);
        }
    }

    atualizarEstoqueVisual(produtoId, novoEstoque) {
        const estoqueElements = document.querySelectorAll('.estoque-quantidade');
        estoqueElements.forEach(element => {
            const card = element.closest('.produto-card');
            const cardProdutoId = this.extrairProdutoIdDoCard(card);
            
            if (cardProdutoId === produtoId) {
                element.textContent = novoEstoque;
                
                // Adiciona classe de alerta se estoque baixo
                const estoqueContainer = element.closest('.produto-estoque');
                if (novoEstoque <= 5) {
                    estoqueContainer.classList.add('estoque-baixo');
                    estoqueContainer.innerHTML = `⚠️ Estoque: <span class="estoque-quantidade">${novoEstoque}</span> unidades (BAIXO!)`;
                }
                
                if (novoEstoque === 0) {
                    estoqueContainer.innerHTML = `❌ ESGOTADO`;
                    estoqueContainer.classList.add('esgotado');
                    this.desabilitarBotaoCompra(card);
                }
            }
        });
    }

    extrairProdutoIdDoCard(card) {
        const botaoCarrinho = card.querySelector('.btn-carrinho');
        if (botaoCarrinho && botaoCarrinho.onclick) {
            return this.extrairProdutoId(botaoCarrinho.onclick.toString());
        }
        return null;
    }

    verificarEstoqueBaixo(produtoId, produto) {
        if (produto.estoque <= 5 && produto.estoque > 0) {
            this.mostrarAlertaEstoque(produto.nome, produto.estoque);
        } else if (produto.estoque === 0) {
            this.mostrarProdutoEsgotado(produto.nome);
        }
    }

    mostrarAlertaEstoque(nomeProduto, estoque) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alerta-estoque';
        alertDiv.innerHTML = `
            <div class="alerta-content">
                ⚠️ <strong>Estoque Baixo!</strong><br>
                ${nomeProduto}: apenas ${estoque} unidades restantes
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 4000);
    }

    mostrarProdutoEsgotado(nomeProduto) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alerta-esgotado';
        alertDiv.innerHTML = `
            <div class="alerta-content">
                ❌ <strong>Produto Esgotado!</strong><br>
                ${nomeProduto} não está mais disponível
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 4000);
    }

    desabilitarBotaoCompra(card) {
        const botaoCarrinho = card.querySelector('.btn-carrinho');
        if (botaoCarrinho) {
            botaoCarrinho.disabled = true;
            botaoCarrinho.textContent = 'Esgotado';
            botaoCarrinho.style.backgroundColor = '#ccc';
        }
    }

    salvarEstoque() {
        localStorage.setItem('designfej_estoque', JSON.stringify(this.produtos));
    }

    carregarEstoqueLocal() {
        const estoqueLocal = localStorage.getItem('designfej_estoque');
        if (estoqueLocal) {
            this.produtos = JSON.parse(estoqueLocal);
            this.atualizarTodosEstoquesVisuais();
        }
    }

    atualizarTodosEstoquesVisuais() {
        Object.keys(this.produtos).forEach(produtoId => {
            const produto = this.produtos[produtoId];
            this.atualizarEstoqueVisual(produtoId, produto.estoque);
        });
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.estoqueManager = new EstoqueManager();
    window.estoqueManager.carregarEstoqueLocal();
>>>>>>> edb44139fc1678797acca79fc165df932d43a4c2
});