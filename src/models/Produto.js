class Produto {
    constructor(id, nome, descricao, preco, imagem, categoria, estoque = 0) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = parseFloat(preco);
        this.imagem = imagem;
        this.categoria = categoria;
        this.estoque = parseInt(estoque);
        this.created_at = new Date();
    }

    validar() {
        const erros = [];
        
        if (!this.nome || this.nome.trim().length < 2) {
            erros.push('Nome do produto deve ter pelo menos 2 caracteres');
        }
        
        if (!this.descricao || this.descricao.trim().length < 10) {
            erros.push('Descrição deve ter pelo menos 10 caracteres');
        }
        
        if (!this.preco || this.preco <= 0) {
            erros.push('Preço deve ser maior que zero');
        }
        
        if (!this.categoria || this.categoria.trim().length < 2) {
            erros.push('Categoria é obrigatória');
        }
        
        if (this.estoque < 0) {
            erros.push('Estoque não pode ser negativo');
        }
        
        return erros;
    }

    calcularPrecoComDesconto(percentualDesconto) {
        return this.preco * (1 - percentualDesconto / 100);
    }

    temEstoque(quantidade = 1) {
        return this.estoque >= quantidade;
    }

    reduzirEstoque(quantidade) {
        if (this.temEstoque(quantidade)) {
            this.estoque -= quantidade;
            return true;
        }
        return false;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            descricao: this.descricao,
            preco: this.preco,
            imagem: this.imagem,
            categoria: this.categoria,
            estoque: this.estoque,
            created_at: this.created_at
        };
    }
}

module.exports = Produto;