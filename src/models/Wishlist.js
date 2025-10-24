class Wishlist {
    constructor(id, cliente_id, produto_id, data_adicao = null) {
        this.id = id;
        this.cliente_id = cliente_id;
        this.produto_id = produto_id;
        this.data_adicao = data_adicao || new Date();
    }

    validar() {
        const erros = [];
        
        if (!this.cliente_id) {
            erros.push('Cliente é obrigatório');
        }
        
        if (!this.produto_id) {
            erros.push('Produto é obrigatório');
        }
        
        return erros;
    }

    toJSON() {
        return {
            id: this.id,
            cliente_id: this.cliente_id,
            produto_id: this.produto_id,
            data_adicao: this.data_adicao
        };
    }
}

module.exports = Wishlist;