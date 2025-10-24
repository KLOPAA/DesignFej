class Avaliacao {
    constructor(id, cliente_nome, produto_id, nota, comentario, data_avaliacao = null) {
        this.id = id;
        this.cliente_nome = cliente_nome;
        this.produto_id = produto_id;
        this.nota = parseInt(nota);
        this.comentario = comentario;
        this.data_avaliacao = data_avaliacao || new Date();
    }

    validar() {
        const erros = [];
        
        if (!this.cliente_nome) {
            erros.push('Nome do cliente é obrigatório');
        }
        
        if (!this.produto_id) {
            erros.push('Produto é obrigatório');
        }
        
        if (!this.nota || this.nota < 1 || this.nota > 5) {
            erros.push('Nota deve ser entre 1 e 5');
        }
        
        if (!this.comentario || this.comentario.trim().length < 10) {
            erros.push('Comentário deve ter pelo menos 10 caracteres');
        }
        
        return erros;
    }

    toJSON() {
        return {
            id: this.id,
            cliente_nome: this.cliente_nome,
            produto_id: this.produto_id,
            nota: this.nota,
            comentario: this.comentario,
            data_avaliacao: this.data_avaliacao,
            produto_nome: this.produto_nome
        };
    }
}

module.exports = Avaliacao;