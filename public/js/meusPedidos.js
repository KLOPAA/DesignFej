// Controlador do lado cliente para meus pedidos
class MeusPedidosController {
    constructor() {
        this.pedidos = [];
        this.nomeUsuario = this.obterNomeUsuario();
        this.init();
    }

    init() {
        this.carregarPedidos();
        this.iniciarAtualizacaoStatus();
    }

    obterNomeUsuario() {
        // Tentar obter do localStorage ou sessão
        return localStorage.getItem('designfej_usuario') || 'Usuário Teste';
    }

    async carregarPedidos() {
        try {
            const response = await fetch(`/api/compras/pedidos?nomeUsuario=${encodeURIComponent(this.nomeUsuario)}`);
            const data = await response.json();
            
            if (data.success && data.pedidos.length > 0) {
                this.pedidos = this.formatarPedidosBanco(data.pedidos);
                this.renderizarPedidos();
            } else {
                // Fallback para localStorage se não houver pedidos no banco
                this.carregarPedidosLocal();
            }
        } catch (error) {
            console.error('Erro ao carregar pedidos do servidor:', error);
            this.carregarPedidosLocal();
        }
    }

    carregarPedidosLocal() {
        this.pedidos = JSON.parse(localStorage.getItem('designfej_pedidos')) || [];
        
        // Criar pedido de exemplo se não houver nenhum
        if (this.pedidos.length === 0) {
            const pedidoExemplo = {
                id: '123456',
                numero_pedido: 'PED123456',
                data: new Date().toISOString(),
                itens: [
                    { nome: 'Brinco de Ouro 18k', quantidade: 1, preco_unitario: 289.90, imagem: '/img/brinco-ouro.jpg' },
                    { nome: 'Colar de Prata Sterling', quantidade: 1, preco_unitario: 189.90, imagem: '/img/colar-prata.jpg' }
                ],
                valor_total: 495.70,
                frete: 15.90,
                tipo_pagamento: 'Cartão de Crédito',
                status: 'Confirmado',
                codigo_rastreamento: 'BR123456789'
            };
            this.pedidos.push(pedidoExemplo);
            localStorage.setItem('designfej_pedidos', JSON.stringify(this.pedidos));
        }
        
        this.renderizarPedidos();
    }

    formatarPedidosBanco(pedidosBanco) {
        return pedidosBanco.map(pedido => ({
            id: pedido.numero_pedido.replace('PED', ''),
            numero_pedido: pedido.numero_pedido,
            data: pedido.data_pedido,
            itens: pedido.itens.map(item => ({
                nome: item.nome,
                quantidade: item.quantidade,
                preco_unitario: parseFloat(item.preco_unitario),
                imagem: item.imagem || '/img/produto-default.jpg'
            })),
            valor_total: parseFloat(pedido.valor_total),
            frete: parseFloat(pedido.frete),
            tipo_pagamento: pedido.tipo_pagamento,
            status: pedido.status,
            codigo_rastreamento: pedido.codigo_rastreamento
        }));
    }

    renderizarPedidos() {
        const container = document.getElementById('pedidos-lista');
        const semPedidos = document.getElementById('sem-pedidos');
        
        if (this.pedidos.length === 0) {
            semPedidos.style.display = 'block';
            container.innerHTML = '';
            return;
        }

        semPedidos.style.display = 'none';
        let html = '';

        this.pedidos.forEach((pedido, index) => {
            const statusClass = this.getStatusClass(pedido.status);
            const statusIcon = this.getStatusIcon(pedido.status);
            const subtotal = pedido.valor_total - pedido.frete;
            
            html += `
                <div class="pedido-card">
                    <div class="pedido-header">
                        <div class="pedido-info">
                            <h3>Pedido #${pedido.numero_pedido || pedido.id}</h3>
                            <p class="pedido-data">${this.formatarData(pedido.data)}</p>
                        </div>
                        <div class="pedido-status ${statusClass}">
                            ${statusIcon} ${pedido.status}
                        </div>
                    </div>
                    
                    <div class="pedido-itens">
                        ${pedido.itens.map(item => `
                            <div class="item-resumo">
                                <span>${item.nome} (${item.quantidade}x)</span>
                                <span>R$ ${(item.preco_unitario * item.quantidade).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="pedido-valores">
                        <div class="valor-linha">
                            <span>Subtotal:</span>
                            <span>R$ ${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="valor-linha">
                            <span>Frete:</span>
                            <span>R$ ${pedido.frete.toFixed(2)}</span>
                        </div>
                        <div class="valor-total">
                            <span>Total:</span>
                            <span>R$ ${pedido.valor_total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="pedido-rastreamento">
                        <h4>📦 Rastreamento</h4>
                        <div class="timeline">
                            ${this.gerarTimeline(pedido.status)}
                        </div>
                        ${pedido.codigo_rastreamento ? `
                            <div class="codigo-rastreamento">
                                <strong>Código de rastreamento:</strong> ${pedido.codigo_rastreamento}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="pedido-acoes">
                        <button onclick="meusPedidosController.verDetalhes(${index})" class="btn-detalhes">Ver Detalhes</button>
                        ${pedido.status === 'Confirmado' ? `
                            <button onclick="meusPedidosController.cancelarPedido(${index})" class="btn-cancelar">Cancelar</button>
                        ` : ''}
                        <button onclick="meusPedidosController.apagarPedido(${index})" class="btn-apagar">🗑️ Apagar</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getStatusClass(status) {
        const classes = {
            'Confirmado': 'status-confirmado',
            'Preparando': 'status-preparando',
            'Enviado': 'status-enviado',
            'Em Trânsito': 'status-transito',
            'Entregue': 'status-entregue',
            'Cancelado': 'status-cancelado'
        };
        return classes[status] || 'status-default';
    }

    getStatusIcon(status) {
        const icons = {
            'Confirmado': '✅',
            'Preparando': '📦',
            'Enviado': '🚚',
            'Em Trânsito': '🛣️',
            'Entregue': '🎉',
            'Cancelado': '❌'
        };
        return icons[status] || '📋';
    }

    gerarTimeline(status) {
        const etapas = [
            { nome: 'Confirmado', concluida: true },
            { nome: 'Preparando', concluida: ['Preparando', 'Enviado', 'Em Trânsito', 'Entregue'].includes(status) },
            { nome: 'Enviado', concluida: ['Enviado', 'Em Trânsito', 'Entregue'].includes(status) },
            { nome: 'Em Trânsito', concluida: ['Em Trânsito', 'Entregue'].includes(status) },
            { nome: 'Entregue', concluida: status === 'Entregue' }
        ];

        return etapas.map(etapa => `
            <div class="timeline-item ${etapa.concluida ? 'concluida' : ''}">
                <div class="timeline-dot"></div>
                <span>${etapa.nome}</span>
            </div>
        `).join('');
    }

    formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    verDetalhes(index) {
        const pedido = this.pedidos[index];
        const detalhes = `
Detalhes do Pedido #${pedido.numero_pedido || pedido.id}

Status: ${pedido.status}
Data: ${this.formatarData(pedido.data)}
Total: R$ ${pedido.valor_total.toFixed(2)}
Pagamento: ${pedido.tipo_pagamento}
${pedido.codigo_rastreamento ? `Rastreamento: ${pedido.codigo_rastreamento}` : ''}

Itens:
${pedido.itens.map(item => `• ${item.nome} (${item.quantidade}x) - R$ ${(item.preco_unitario * item.quantidade).toFixed(2)}`).join('\n')}
        `;
        alert(detalhes);
    }

    async cancelarPedido(index) {
        if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
            return;
        }

        const pedido = this.pedidos[index];
        
        try {
            // Tentar cancelar no servidor
            const response = await fetch(`/api/compras/pedidos/${pedido.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    status: 'Cancelado',
                    descricao: 'Pedido cancelado pelo cliente'
                })
            });

            if (response.ok) {
                pedido.status = 'Cancelado';
                this.renderizarPedidos();
                this.mostrarMensagem('Pedido cancelado com sucesso!', 'success');
            } else {
                throw new Error('Erro no servidor');
            }
        } catch (error) {
            console.error('Erro ao cancelar no servidor:', error);
            // Fallback para cancelamento local
            pedido.status = 'Cancelado';
            localStorage.setItem('designfej_pedidos', JSON.stringify(this.pedidos));
            this.renderizarPedidos();
            this.mostrarMensagem('Pedido cancelado com sucesso!', 'success');
        }
    }

    apagarPedido(index) {
        const pedido = this.pedidos[index];
        if (!confirm(`Tem certeza que deseja apagar o pedido #${pedido.numero_pedido || pedido.id}?\nEsta ação não pode ser desfeita.`)) {
            return;
        }

        this.pedidos.splice(index, 1);
        localStorage.setItem('designfej_pedidos', JSON.stringify(this.pedidos));
        
        if (this.pedidos.length === 0) {
            document.getElementById('sem-pedidos').style.display = 'block';
            document.getElementById('pedidos-lista').innerHTML = '';
        } else {
            this.renderizarPedidos();
        }
        
        this.mostrarMensagem('Pedido apagado com sucesso!', 'success');
    }

    limparTodosPedidos() {
        if (!confirm('Tem certeza que deseja apagar TODOS os pedidos?\nEsta ação não pode ser desfeita.')) {
            return;
        }

        this.pedidos = [];
        localStorage.removeItem('designfej_pedidos');
        document.getElementById('sem-pedidos').style.display = 'block';
        document.getElementById('pedidos-lista').innerHTML = '';
        this.mostrarMensagem('Todos os pedidos foram apagados!', 'success');
    }

    async simularAtualizacao() {
        let houveMudanca = false;
        
        this.pedidos.forEach(pedido => {
            if (pedido.status !== 'Entregue' && pedido.status !== 'Cancelado') {
                const novoStatus = this.forcarProximoStatus(pedido.status);
                if (novoStatus !== pedido.status) {
                    pedido.status = novoStatus;
                    houveMudanca = true;
                }
            }
        });
        
        if (houveMudanca) {
            localStorage.setItem('designfej_pedidos', JSON.stringify(this.pedidos));
            this.renderizarPedidos();
            this.mostrarMensagem('📦 Status dos pedidos atualizado!', 'success');
        } else {
            this.mostrarMensagem('✅ Todos os pedidos já estão finalizados!', 'info');
        }
    }

    iniciarAtualizacaoStatus() {
        // Atualizar status a cada 30 segundos
        setInterval(() => {
            this.atualizarStatusPedidos();
        }, 30000);
    }

    atualizarStatusPedidos() {
        let houveMudanca = false;
        
        this.pedidos.forEach(pedido => {
            if (pedido.status !== 'Entregue' && pedido.status !== 'Cancelado') {
                const novoStatus = this.proximoStatus(pedido.status);
                if (novoStatus !== pedido.status) {
                    pedido.status = novoStatus;
                    houveMudanca = true;
                    console.log(`📦 Pedido #${pedido.numero_pedido || pedido.id} atualizado para: ${novoStatus}`);
                }
            }
        });
        
        if (houveMudanca) {
            localStorage.setItem('designfej_pedidos', JSON.stringify(this.pedidos));
            this.renderizarPedidos();
        }
    }

    proximoStatus(statusAtual) {
        const sequencia = {
            'Confirmado': 'Preparando',
            'Preparando': 'Enviado', 
            'Enviado': 'Em Trânsito',
            'Em Trânsito': 'Entregue'
        };
        
        // 20% de chance de avançar para próximo status
        if (Math.random() < 0.2) {
            return sequencia[statusAtual] || statusAtual;
        }
        
        return statusAtual;
    }

    forcarProximoStatus(statusAtual) {
        const sequencia = {
            'Confirmado': 'Preparando',
            'Preparando': 'Enviado', 
            'Enviado': 'Em Trânsito',
            'Em Trânsito': 'Entregue'
        };
        
        return sequencia[statusAtual] || statusAtual;
    }

    mostrarMensagem(mensagem, tipo = 'info') {
        // Criar ou atualizar elemento de mensagem
        let msgElement = document.getElementById('mensagem-temporaria');
        if (!msgElement) {
            msgElement = document.createElement('div');
            msgElement.id = 'mensagem-temporaria';
            msgElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(msgElement);
        }

        // Definir cor baseada no tipo
        const cores = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };

        msgElement.style.backgroundColor = cores[tipo] || cores.info;
        msgElement.textContent = mensagem;
        msgElement.style.opacity = '1';

        // Remover após 3 segundos
        setTimeout(() => {
            msgElement.style.opacity = '0';
            setTimeout(() => {
                if (msgElement.parentNode) {
                    msgElement.parentNode.removeChild(msgElement);
                }
            }, 300);
        }, 3000);
    }
}

// Inicializar controlador quando a página carregar
let meusPedidosController;
document.addEventListener('DOMContentLoaded', function() {
    meusPedidosController = new MeusPedidosController();
});