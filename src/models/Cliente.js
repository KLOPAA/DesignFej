class Cliente {
    constructor(id, nome, email, senha_hash, endereco, token_redefinicao = null, expira_em = null) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha_hash = senha_hash;
        this.endereco = endereco;
        this.token_redefinicao = token_redefinicao;
        this.expira_em = expira_em;
        this.criado_em = new Date();
    }

    validar() {
        const erros = [];
        
        if (!this.nome || this.nome.trim().length < 2) {
            erros.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!this.email || !this.email.includes('@')) {
            erros.push('Email inválido');
        }
        
        if (!this.endereco || this.endereco.trim().length < 5) {
            erros.push('Endereço deve ter pelo menos 5 caracteres');
        }
        
        return erros;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            endereco: this.endereco,
            criado_em: this.criado_em
        };
    }
}

module.exports = Cliente;