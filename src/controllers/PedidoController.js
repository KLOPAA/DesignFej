const pedidoRepository = require('../repositories/PedidoRepository');
const { PedidoCalculator } = require('../patterns/Strategy');
const { NotificationManager } = require('../patterns/Observer');

class PedidoController {
    constructor() {
        this.calculator = new PedidoCalculator();
        this.notificationManager = new NotificationManager();
    }

    async criar(req, res) {
        try {
            const { sessao_id, total, forma_pagamento, endereco_entrega, status } = req.body;

            if (!sessao_id || !total || !forma_pagamento || !endereco_entrega) {
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
            }

            const pedido = await pedidoRepository.criar({
                sessao_id,
                total,
                forma_pagamento,
                endereco_entrega,
                status: status || 'pendente'
            });

            // Notificar observadores sobre novo pedido
            this.notificationManager.notificarNovoPedido(pedido);

            console.log('[SUCESSO] Pedido criado:', pedido.id);
            
            res.status(201).json({
                mensagem: 'Pedido criado com sucesso!',
                pedido: pedido.toJSON()
            });

        } catch (error) {
            console.error('[ERRO] Erro ao criar pedido:', error.message);
            res.status(500).json({ erro: 'Erro ao criar pedido.' });
        }
    }

    async listarTodos(req, res) {
        try {
            const pedidos = await pedidoRepository.listarTodos();
            const pedidosJSON = pedidos.map(pedido => pedido.toJSON());
            
            res.json(pedidosJSON);
        } catch (error) {
            console.error('[ERRO] Erro ao listar pedidos:', error.message);
            res.status(500).json({ erro: 'Erro ao listar pedidos.' });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            
            const pedido = await pedidoRepository.buscarPorId(id);
            if (!pedido) {
                return res.status(404).json({ erro: 'Pedido não encontrado.' });
            }

            res.json(pedido.toJSON());
        } catch (error) {
            console.error('[ERRO] Erro ao buscar pedido:', error.message);
            res.status(500).json({ erro: 'Erro ao buscar pedido.' });
        }
    }

    async buscarPorSessao(req, res) {
        try {
            const { sessao_id } = req.query;
            
            if (!sessao_id) {
                return res.status(400).json({ erro: 'ID da sessão é obrigatório.' });
            }

            const pedidos = await pedidoRepository.buscarPorSessao(sessao_id);
            const pedidosJSON = pedidos.map(pedido => pedido.toJSON());
            
            res.json(pedidosJSON);
        } catch (error) {
            console.error('[ERRO] Erro ao buscar pedidos por sessão:', error.message);
            res.status(500).json({ erro: 'Erro ao buscar pedidos por sessão.' });
        }
    }

    async buscarPorStatus(req, res) {
        try {
            const { status } = req.query;
            
            if (!status) {
                return res.status(400).json({ erro: 'Status é obrigatório.' });
            }

            const pedidos = await pedidoRepository.buscarPorStatus(status);
            const pedidosJSON = pedidos.map(pedido => pedido.toJSON());
            
            res.json(pedidosJSON);
        } catch (error) {
            console.error('[ERRO] Erro ao buscar pedidos por status:', error.message);
            res.status(500).json({ erro: 'Erro ao buscar pedidos por status.' });
        }
    }

    async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ erro: 'Status é obrigatório.' });
            }

            const pedido = await pedidoRepository.atualizarStatus(id, status);
            if (!pedido) {
                return res.status(404).json({ erro: 'Pedido não encontrado.' });
            }

            // Notificar se pedido foi confirmado
            if (status === 'confirmado') {
                this.notificationManager.notificarPedidoConfirmado(pedido);
            }

            res.json({
                mensagem: 'Status do pedido atualizado com sucesso!',
                pedido: pedido.toJSON()
            });

        } catch (error) {
            console.error('[ERRO] Erro ao atualizar status do pedido:', error.message);
            res.status(500).json({ erro: 'Erro ao atualizar status do pedido.' });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;

            const sucesso = await pedidoRepository.excluir(id);
            if (!sucesso) {
                return res.status(404).json({ erro: 'Pedido não encontrado.' });
            }

            res.json({ mensagem: 'Pedido excluído com sucesso!' });

        } catch (error) {
            console.error('[ERRO] Erro ao excluir pedido:', error.message);
            res.status(500).json({ erro: 'Erro ao excluir pedido.' });
        }
    }

    async calcularPedido(req, res) {
        try {
            const { itens, peso, distancia, cupom } = req.body;

            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({ erro: 'Itens do pedido são obrigatórios' });
            }

            const calculo = this.calculator.calcularTotal(
                itens,
                peso || 1,
                distancia || 10,
                cupom
            );

            res.json({
                mensagem: 'Cálculo realizado com sucesso!',
                calculo
            });

        } catch (error) {
            console.error('[ERRO] Erro ao calcular pedido:', error.message);
            res.status(500).json({ erro: 'Erro ao calcular pedido' });
        }
    }

    async obterEstatisticas(req, res) {
        try {
            const estatisticas = await pedidoRepository.obterEstatisticas();
            
            res.json({
                mensagem: 'Estatísticas obtidas com sucesso!',
                estatisticas
            });

        } catch (error) {
            console.error('[ERRO] Erro ao obter estatísticas:', error.message);
            res.status(500).json({ erro: 'Erro ao obter estatísticas.' });
        }
    }
}

module.exports = new PedidoController();