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
});