class Pedido {
    constructor(id, sessao_id, total, forma_pagamento, endereco_entrega, status = 'pendente') {
        this.id = id;
        this.sessao_id = sessao_id;
        this.total = parseFloat(total);
        this.forma_pagamento = forma_pagamento;
        this.endereco_entrega = endereco_entrega;
        this.status = status;
        this.created_at = new Date();
        this.itens = [];
    }

    static STATUS = {
        PENDENTE: 'pendente',
        PROCESSANDO: 'processando',
        ENVIADO: 'enviado',
        ENTREGUE: 'entregue',
        CANCELADO: 'cancelado'
    };

    validar() {
        const erros = [];
        
        if (!this.sessao_id) {
            erros.push('Sessão é obrigatória');
        }
        
        if (!this.total || this.total <= 0) {
            erros.push('Total deve ser maior que zero');
        }
        
        if (!this.forma_pagamento) {
            erros.push('Forma de pagamento é obrigatória');
        }
        
        if (!this.endereco_entrega) {
            erros.push('Endereço de entrega é obrigatório');
        }
        
        if (!Object.values(Pedido.STATUS).includes(this.status)) {
            erros.push('Status inválido');
        }
        
        return erros;
    }

    alterarStatus(novoStatus) {
        if (Object.values(Pedido.STATUS).includes(novoStatus)) {
            this.status = novoStatus;
            return true;
        }
        return false;
    }

    podeSerCancelado() {
        return this.status === Pedido.STATUS.PENDENTE || this.status === Pedido.STATUS.PROCESSANDO;
    }

    calcularTaxaEntrega() {
        // Lógica simples de taxa de entrega
        if (this.total >= 200) {
            return 0; // Frete grátis
        }
        return 15.90;
    }

    calcularTotalComTaxa() {
        return this.total + this.calcularTaxaEntrega();
    }

    toJSON() {
        return {
            id: this.id,
            sessao_id: this.sessao_id,
            total: this.total,
            forma_pagamento: this.forma_pagamento,
            endereco_entrega: this.endereco_entrega,
            status: this.status,
            taxa_entrega: this.calcularTaxaEntrega(),
            total_com_taxa: this.calcularTotalComTaxa(),
            created_at: this.created_at,
            itens: this.itens
        };
    }
}

module.exports = Pedido;