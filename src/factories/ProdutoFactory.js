const Produto = require('../models/Produto');

class ProdutoFactory {
    static criarProduto(tipo, dados) {
        const { nome, descricao, preco, imagem, estoque } = dados;
        
        switch (tipo.toLowerCase()) {
            case 'anel':
                return new Anel(null, nome, descricao, preco, imagem, 'Anéis', estoque);
            case 'colar':
                return new Colar(null, nome, descricao, preco, imagem, 'Colares', estoque);
            case 'brinco':
                return new Brinco(null, nome, descricao, preco, imagem, 'Brincos', estoque);
            case 'pingente':
                return new Pingente(null, nome, descricao, preco, imagem, 'Pingentes', estoque);
            case 'alianca':
                return new Alianca(null, nome, descricao, preco, imagem, 'Alianças', estoque);
            default:
                return new Produto(null, nome, descricao, preco, imagem, 'Geral', estoque);
        }
    }

    static getTiposDisponiveis() {
        return ['anel', 'colar', 'brinco', 'pingente', 'alianca'];
    }
}

class Anel extends Produto {
    constructor(id, nome, descricao, preco, imagem, categoria, estoque) {
        super(id, nome, descricao, preco, imagem, categoria, estoque);
        this.tamanhos = ['14', '16', '18', '20', '22'];
    }

    validarTamanho(tamanho) {
        return this.tamanhos.includes(tamanho);
    }
}

class Colar extends Produto {
    constructor(id, nome, descricao, preco, imagem, categoria, estoque) {
        super(id, nome, descricao, preco, imagem, categoria, estoque);
        this.comprimentos = ['40cm', '45cm', '50cm', '60cm'];
    }

    validarComprimento(comprimento) {
        return this.comprimentos.includes(comprimento);
    }
}

class Brinco extends Produto {
    constructor(id, nome, descricao, preco, imagem, categoria, estoque) {
        super(id, nome, descricao, preco, imagem, categoria, estoque);
        this.tipos = ['argola', 'gota', 'botao', 'pendente'];
    }

    validarTipo(tipo) {
        return this.tipos.includes(tipo);
    }
}

class Pingente extends Produto {
    constructor(id, nome, descricao, preco, imagem, categoria, estoque) {
        super(id, nome, descricao, preco, imagem, categoria, estoque);
        this.materiais = ['ouro', 'prata', 'aco'];
    }

    validarMaterial(material) {
        return this.materiais.includes(material);
    }
}

class Alianca extends Produto {
    constructor(id, nome, descricao, preco, imagem, categoria, estoque) {
        super(id, nome, descricao, preco, imagem, categoria, estoque);
        this.tamanhos = ['14', '16', '18', '20', '22'];
        this.larguras = ['3mm', '4mm', '5mm', '6mm'];
    }

    validarTamanho(tamanho) {
        return this.tamanhos.includes(tamanho);
    }

    validarLargura(largura) {
        return this.larguras.includes(largura);
    }
}

module.exports = { ProdutoFactory, Anel, Colar, Brinco, Pingente, Alianca };