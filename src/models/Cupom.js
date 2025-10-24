class Cupom {
    constructor(id, codigo, tipo, valor, data_inicio, data_fim, ativo = true, usado = false) {
        this.id = id;
        this.codigo = codigo.toUpperCase();
        this.tipo = tipo; // 'percentual', 'fixo', 'progressivo'
        this.valor = parseFloat(valor);
        this.data_inicio = new Date(data_inicio);
        this.data_fim = new Date(data_fim);
        this.ativo = ativo;
        this.usado = usado;
        this.criado_em = new Date();
    }

    validar() {
        const erros = [];
        
        if (!this.codigo || this.codigo.length < 3) {
            erros.push('Código deve ter pelo menos 3 caracteres');
        }
        
        if (!['percentual', 'fixo', 'progressivo'].includes(this.tipo)) {
            erros.push('Tipo deve ser: percentual, fixo ou progressivo');
        }
        
        if (!this.valor || this.valor <= 0) {
            erros.push('Valor deve ser maior que zero');
        }
        
        if (this.tipo === 'percentual' && this.valor > 100) {
            erros.push('Percentual não pode ser maior que 100%');
        }
        
        if (this.data_inicio >= this.data_fim) {
            erros.push('Data de início deve ser anterior à data de fim');
        }
        
        return erros;
    }

    isValido() {
        const agora = new Date();
        return this.ativo && 
               !this.usado && 
               agora >= this.data_inicio && 
               agora <= this.data_fim;
    }

    usar() {
        if (this.isValido()) {
            this.usado = true;
            return true;
        }
        return false;
    }

    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            tipo: this.tipo,
            valor: this.valor,
            data_inicio: this.data_inicio,
            data_fim: this.data_fim,
            ativo: this.ativo,
            usado: this.usado,
            criado_em: this.criado_em
        };
    }
}

module.exports = Cupom;