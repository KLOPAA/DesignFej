// Controlador do lado cliente para pós-compra
class PosCompraController {
    constructor() {
        this.dadosPedido = {
            itens: [],
            subtotal: 0,
            frete: 15.90,
            total: 0
        };
        this.init();
    }

    init() {
        this.carregarItensPedido();
        this.aplicarFreteFixo();
        this.configurarCamposCartao();
    }

    carregarItensPedido() {
        const cartItems = JSON.parse(localStorage.getItem('designfej_cart')) || [];
        const container = document.getElementById('itens-pedido');
        let subtotal = 0;

        if (cartItems.length === 0) {
            container.innerHTML = '<p>Nenhum item no carrinho</p>';
            return;
        }

        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            container.innerHTML += `
                <div class="item-pedido">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='/img/produto-default.jpg'">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>Quantidade: ${item.quantity}</p>
                        <p>Preço unitário: R$ ${item.price.toFixed(2)}</p>
                        <p><strong>Total: R$ ${itemTotal.toFixed(2)}</strong></p>
                    </div>
                </div>
            `;
        });

        this.dadosPedido.itens = cartItems;
        this.dadosPedido.subtotal = subtotal;
        
        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('total-subtotal').textContent = subtotal.toFixed(2);
        this.atualizarTotal();
    }

    aplicarFreteFixo() {
        this.dadosPedido.frete = 15.90;
        this.atualizarTotal();
    }

    configurarCamposCartao() {
        // Formatar número do cartão
        const numeroCartao = document.getElementById('numero-cartao');
        if (numeroCartao) {
            numeroCartao.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                e.target.value = value;
            });
        }
        
        // Formatar validade
        const validade = document.getElementById('validade');
        if (validade) {
            validade.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
        
        // Apenas números no CVV
        const cvv = document.getElementById('cvv');
        if (cvv) {
            cvv.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }
    }

    atualizarTotal() {
        const total = this.dadosPedido.subtotal + this.dadosPedido.frete;
        this.dadosPedido.total = total;
        
        const freteElement = document.getElementById('total-frete');
        const totalElement = document.getElementById('total-geral');
        
        if (freteElement) freteElement.textContent = this.dadosPedido.frete.toFixed(2);
        if (totalElement) totalElement.textContent = total.toFixed(2);
    }

    async confirmarPedido() {
        if (!this.validarPagamento()) {
            return;
        }
        
        const metodoPagamento = document.querySelector('input[name="pagamento"]:checked').value;
        const nomeCartao = document.getElementById('nome-cartao').value;
        const tipoPagamento = `Cartão de ${metodoPagamento === 'credito' ? 'Crédito' : 'Débito'}`;
        
        try {
            // Salvar pedido no banco de dados
            const response = await fetch('/api/compras/finalizar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itens: this.dadosPedido.itens.map(item => ({
                        produtoId: item.id,
                        quantidade: item.quantity
                    })),
                    nomeUsuario: nomeCartao,
                    tipoPagamento: tipoPagamento,
                    valorTotal: this.dadosPedido.total
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Criar pedido para localStorage (compatibilidade)
                const pedido = {
                    id: result.numeroPedido.replace(/[PED]/g, ''),
                    numero_pedido: result.numeroPedido,
                    data: new Date().toISOString(),
                    itens: this.dadosPedido.itens.map(item => ({
                        nome: item.name,
                        quantidade: item.quantity,
                        preco_unitario: item.price,
                        imagem: item.image
                    })),
                    valor_total: this.dadosPedido.total,
                    frete: this.dadosPedido.frete,
                    tipo_pagamento: tipoPagamento,
                    status: 'Confirmado',
                    codigo_rastreamento: result.codigoRastreamento
                };
                
                // Salvar no localStorage para compatibilidade
                const pedidos = JSON.parse(localStorage.getItem('designfej_pedidos')) || [];
                pedidos.push(pedido);
                localStorage.setItem('designfej_pedidos', JSON.stringify(pedidos));
                
                // Salvar nome do usuário para futuras consultas
                localStorage.setItem('designfej_usuario', nomeCartao);
                
                this.mostrarSucesso(result, tipoPagamento, nomeCartao);
                
                // Limpa carrinho
                localStorage.removeItem('designfej_cart');
                
                // Redireciona para meus pedidos
                setTimeout(() => {
                    window.location.href = 'meusPedidos.html';
                }, 3000);
            } else {
                this.mostrarErro('Erro ao confirmar pedido: ' + result.message);
            }
        } catch (error) {
            console.error('Erro ao confirmar pedido:', error);
            // Fallback para salvamento local
            this.salvarPedidoLocal(tipoPagamento, nomeCartao);
        }
    }

    salvarPedidoLocal(tipoPagamento, nomeCartao) {
        const pedido = {
            id: Date.now().toString().slice(-6),
            numero_pedido: 'PED' + Date.now().toString().slice(-6),
            data: new Date().toISOString(),
            itens: this.dadosPedido.itens.map(item => ({
                nome: item.name,
                quantidade: item.quantity,
                preco_unitario: item.price,
                imagem: item.image
            })),
            valor_total: this.dadosPedido.total,
            frete: this.dadosPedido.frete,
            tipo_pagamento: tipoPagamento,
            status: 'Confirmado',
            codigo_rastreamento: 'BR' + Math.random().toString().slice(2, 11)
        };
        
        // Salvar no localStorage
        const pedidos = JSON.parse(localStorage.getItem('designfej_pedidos')) || [];
        pedidos.push(pedido);
        localStorage.setItem('designfej_pedidos', JSON.stringify(pedidos));
        localStorage.setItem('designfej_usuario', nomeCartao);
        
        this.mostrarSucesso({
            numeroPedido: pedido.numero_pedido,
            codigoRastreamento: pedido.codigo_rastreamento
        }, tipoPagamento, nomeCartao);
        
        // Limpa carrinho
        localStorage.removeItem('designfej_cart');
        
        // Redireciona para meus pedidos
        setTimeout(() => {
            window.location.href = 'meusPedidos.html';
        }, 3000);
    }

    mostrarSucesso(result, tipoPagamento, nomeCartao) {
        const mensagem = `
✅ Pedido confirmado com sucesso!

📦 Número: ${result.numeroPedido}
💰 Total: R$ ${this.dadosPedido.total.toFixed(2)}
🚚 Frete: R$ ${this.dadosPedido.frete.toFixed(2)}
💳 Pagamento: ${tipoPagamento}
👤 Titular: ${nomeCartao}
📍 Rastreamento: ${result.codigoRastreamento}

Você será redirecionado para "Meus Pedidos" em alguns segundos...
        `;
        
        alert(mensagem);
    }

    mostrarErro(mensagem) {
        alert('❌ ' + mensagem);
    }

    validarPagamento() {
        const numeroCartao = document.getElementById('numero-cartao').value.replace(/\s/g, '');
        const validade = document.getElementById('validade').value;
        const cvv = document.getElementById('cvv').value;
        const nomeCartao = document.getElementById('nome-cartao').value.trim();
        
        if (numeroCartao.length !== 16) {
            this.mostrarErro('Por favor, digite um número de cartão válido (16 dígitos)');
            return false;
        }
        
        if (validade.length !== 5 || !validade.includes('/')) {
            this.mostrarErro('Por favor, digite uma validade válida (MM/AA)');
            return false;
        }
        
        if (cvv.length !== 3) {
            this.mostrarErro('Por favor, digite um CVV válido (3 dígitos)');
            return false;
        }
        
        if (nomeCartao.length < 2) {
            this.mostrarErro('Por favor, digite o nome do titular do cartão');
            return false;
        }
        
        return true;
    }
}

// Inicializar controlador quando a página carregar
let posCompraController;
document.addEventListener('DOMContentLoaded', function() {
    posCompraController = new PosCompraController();
});