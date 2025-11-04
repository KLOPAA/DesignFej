class ItemCarrinho {
    constructor(id, produto_id, quantidade, sessao_id, produto = null) {
        this.id = id;
        this.produto_id = produto_id;
        this.quantidade = parseInt(quantidade);
        this.sessao_id = sessao_id;
        this.produto = produto;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    calcularSubtotal() {
        if (this.produto) {
            return this.quantidade * this.produto.preco;
        }
        return 0;
    }

    validar() {
        const erros = [];
        
        if (!this.produto_id || this.produto_id <= 0) {
            erros.push('ID do produto é obrigatório');
        }
        
        if (!this.quantidade || this.quantidade <= 0) {
            erros.push('Quantidade deve ser maior que zero');
        }
        
        if (!this.sessao_id) {
            erros.push('Sessão é obrigatória');
        }
        
        return erros;
    }

    toJSON() {
        return {
            id: this.id,
            produto_id: this.produto_id,
            quantidade: this.quantidade,
            sessao_id: this.sessao_id,
            produto: this.produto ? this.produto.toJSON() : null,
            subtotal: this.calcularSubtotal(),
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

class Carrinho {
    constructor(sessao_id) {
        this.sessao_id = sessao_id;
        this.itens = [];
    }

    adicionarItem(item) {
        if (item instanceof ItemCarrinho) {
            this.itens.push(item);
        }
    }

    removerItem(itemId) {
        this.itens = this.itens.filter(item => item.id !== itemId);
    }

    calcularTotal() {
        return this.itens.reduce((total, item) => total + item.calcularSubtotal(), 0);
    }

    calcularTotalItens() {
        return this.itens.reduce((total, item) => total + item.quantidade, 0);
    }

    limpar() {
        this.itens = [];
    }

    toJSON() {
        return {
            sessao_id: this.sessao_id,
            itens: this.itens.map(item => item.toJSON()),
            total: this.calcularTotal(),
            total_itens: this.calcularTotalItens()
        };
    }
}

module.exports = { ItemCarrinho, Carrinho };