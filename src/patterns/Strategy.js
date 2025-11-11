// Padrão Strategy para cálculos de frete e desconto

class FreteStrategy {
    calcular(peso, distancia) {
        throw new Error('Método calcular deve ser implementado');
    }
}

class FreteNormal extends FreteStrategy {
    calcular(peso, distancia) {
        const taxaBase = 10;
        const taxaPeso = peso * 2;
        const taxaDistancia = distancia * 0.5;
        return taxaBase + taxaPeso + taxaDistancia;
    }
}

class FreteExpresso extends FreteStrategy {
    calcular(peso, distancia) {
        const taxaBase = 25;
        const taxaPeso = peso * 3;
        const taxaDistancia = distancia * 0.8;
        return taxaBase + taxaPeso + taxaDistancia;
    }
}

class FreteGratis extends FreteStrategy {
    calcular(peso, distancia) {
        return 0;
    }
}

class DescontoStrategy {
    aplicar(valor) {
        throw new Error('Método aplicar deve ser implementado');
    }
}

class DescontoPorcentagem extends DescontoStrategy {
    constructor(percentual) {
        super();
        this.percentual = percentual;
    }

    aplicar(valor) {
        return valor * (this.percentual / 100);
    }
}

class DescontoValorFixo extends DescontoStrategy {
    constructor(valorDesconto) {
        super();
        this.valorDesconto = valorDesconto;
    }

    aplicar(valor) {
        return Math.min(this.valorDesconto, valor);
    }
}

class DescontoProgressivo extends DescontoStrategy {
    aplicar(valor) {
        if (valor >= 1000) return valor * 0.15;
        if (valor >= 500) return valor * 0.10;
        if (valor >= 200) return valor * 0.05;
        return 0;
    }
}

class CalculadoraFrete {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    calcular(peso, distancia) {
        return this.strategy.calcular(peso, distancia);
    }
}

class CalculadoraDesconto {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    aplicar(valor) {
        return this.strategy.aplicar(valor);
    }
}

class PedidoCalculator {
    constructor() {
        this.calculadoraFrete = new CalculadoraFrete(new FreteNormal());
        this.calculadoraDesconto = new CalculadoraDesconto(new DescontoProgressivo());
    }

    calcularTotal(itens, peso, distancia, cupomDesconto = null) {
        const subtotal = itens.reduce((total, item) => {
            return total + (item.preco * item.quantidade);
        }, 0);

        // Aplicar desconto se houver cupom
        let desconto = 0;
        if (cupomDesconto) {
            switch (cupomDesconto.tipo) {
                case 'percentual':
                    this.calculadoraDesconto.setStrategy(new DescontoPorcentagem(cupomDesconto.valor));
                    break;
                case 'fixo':
                    this.calculadoraDesconto.setStrategy(new DescontoValorFixo(cupomDesconto.valor));
                    break;
                case 'progressivo':
                    this.calculadoraDesconto.setStrategy(new DescontoProgressivo());
                    break;
            }
            desconto = this.calculadoraDesconto.aplicar(subtotal);
        }

        // Definir estratégia de frete baseada no valor
        if (subtotal >= 300) {
            this.calculadoraFrete.setStrategy(new FreteGratis());
        } else if (subtotal >= 150) {
            this.calculadoraFrete.setStrategy(new FreteNormal());
        } else {
            this.calculadoraFrete.setStrategy(new FreteExpresso());
        }

        const frete = this.calculadoraFrete.calcular(peso, distancia);
        const total = subtotal - desconto + frete;

        return {
            subtotal: subtotal.toFixed(2),
            desconto: desconto.toFixed(2),
            frete: frete.toFixed(2),
            total: total.toFixed(2)
        };
    }
}

module.exports = {
    FreteStrategy,
    FreteNormal,
    FreteExpresso,
    FreteGratis,
    DescontoStrategy,
    DescontoPorcentagem,
    DescontoValorFixo,
    DescontoProgressivo,
    CalculadoraFrete,
    CalculadoraDesconto,
    PedidoCalculator
};