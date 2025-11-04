class Observer {
    update(data) {
        throw new Error('Método update deve ser implementado');
    }
}

class Subject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class EstoqueObserver extends Observer {
    update(data) {
        if (data.tipo === 'estoque_baixo') {
            console.log(`⚠️ ALERTA: Produto ${data.produto.nome} com estoque baixo: ${data.produto.estoque} unidades`);
            this.enviarNotificacaoEstoque(data.produto);
        } else if (data.tipo === 'compra_realizada') {
            this.atualizarEstoque(data.itens);
        }
    }

    atualizarEstoque(itens) {
        itens.forEach(item => {
            console.log(`📦 Estoque atualizado: ${item.produto.nome} - Quantidade vendida: ${item.quantidade}`);
            if (item.produto.estoque <= 5) {
                console.log(`⚠️ ESTOQUE CRÍTICO: ${item.produto.nome} - Restam apenas ${item.produto.estoque} unidades`);
            }
        });
    }

    enviarNotificacaoEstoque(produto) {
        // Notificação de estoque baixo registrada
    }
}

class PedidoObserver extends Observer {
    update(data) {
        if (data.tipo === 'novo_pedido') {
            console.log(`🛍️ Novo pedido recebido: #${data.pedido.id}`);
            this.processarPedido(data.pedido);
        }
    }

    processarPedido(pedido) {
        console.log(`📦 Processando pedido #${pedido.id} - Total: R$ ${pedido.total}`);
    }
}



class NotificationManager extends Subject {
    constructor() {
        super();
        this.setupObservers();
    }

    setupObservers() {
        this.addObserver(new EstoqueObserver());
        this.addObserver(new PedidoObserver());
    }

    notificarCompraRealizada(itens) {
        this.notifyObservers({
            tipo: 'compra_realizada',
            itens: itens
        });
    }

    notificarEstoqueBaixo(produto) {
        this.notifyObservers({
            tipo: 'estoque_baixo',
            produto: produto
        });
    }

    notificarNovoPedido(pedido) {
        this.notifyObservers({
            tipo: 'novo_pedido',
            pedido: pedido
        });
    }


}

module.exports = { Observer, Subject, NotificationManager };