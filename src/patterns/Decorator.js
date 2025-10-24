// Componente base para cupons
class CupomBase {
    constructor(codigo, descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    aplicarDesconto(valor) {
        return valor;
    }

    getDescricao() {
        return this.descricao;
    }
}

// Decorator base
class CupomDecorator extends CupomBase {
    constructor(cupom) {
        super(cupom.codigo, cupom.descricao);
        this.cupom = cupom;
    }

    aplicarDesconto(valor) {
        return this.cupom.aplicarDesconto(valor);
    }

    getDescricao() {
        return this.cupom.getDescricao();
    }
}

// Decorator para desconto percentual
class DescontoPercentual extends CupomDecorator {
    constructor(cupom, percentual) {
        super(cupom);
        this.percentual = percentual;
    }

    aplicarDesconto(valor) {
        const valorBase = super.aplicarDesconto(valor);
        const desconto = valorBase * (this.percentual / 100);
        return valorBase - desconto;
    }

    getDescricao() {
        return `${super.getDescricao()} + ${this.percentual}% de desconto`;
    }
}

// Decorator para desconto fixo
class DescontoFixo extends CupomDecorator {
    constructor(cupom, valorDesconto) {
        super(cupom);
        this.valorDesconto = valorDesconto;
    }

    aplicarDesconto(valor) {
        const valorBase = super.aplicarDesconto(valor);
        return Math.max(0, valorBase - this.valorDesconto);
    }

    getDescricao() {
        return `${super.getDescricao()} + R$ ${this.valorDesconto.toFixed(2)} de desconto`;
    }
}

// Decorator para frete grátis
class FreteGratis extends CupomDecorator {
    constructor(cupom) {
        super(cupom);
    }

    aplicarDesconto(valor, frete = 0) {
        const valorBase = super.aplicarDesconto(valor);
        return { valor: valorBase, freteGratis: true };
    }

    getDescricao() {
        return `${super.getDescricao()} + Frete Grátis`;
    }
}

// Decorator para desconto progressivo
class DescontoProgressivo extends CupomDecorator {
    constructor(cupom, valorMinimo, percentualExtra) {
        super(cupom);
        this.valorMinimo = valorMinimo;
        this.percentualExtra = percentualExtra;
    }

    aplicarDesconto(valor) {
        const valorBase = super.aplicarDesconto(valor);
        
        if (valorBase >= this.valorMinimo) {
            const descontoExtra = valorBase * (this.percentualExtra / 100);
            return valorBase - descontoExtra;
        }
        
        return valorBase;
    }

    getDescricao() {
        return `${super.getDescricao()} + ${this.percentualExtra}% extra acima de R$ ${this.valorMinimo}`;
    }
}

module.exports = {
    CupomBase,
    CupomDecorator,
    DescontoPercentual,
    DescontoFixo,
    FreteGratis,
    DescontoProgressivo
};