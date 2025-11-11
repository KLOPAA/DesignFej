const carrinhoRepository = require('../repositories/CarrinhoRepository');
const produtoRepository = require('../repositories/ProdutoRepository');

class CarrinhoController {
    // Middleware para identificar a sessão/usuario
    getSessionId(req) {
        return req.user ? req.user.id : (req.sessionID || req.headers['session-id'] || 'guest');
    }

    async adicionarItem(req, res) {
        try {
            const { produto_id, quantidade = 1 } = req.body;
            const sessao_id = this.getSessionId(req);

            if (!produto_id) {
                return res.status(400).json({ error: 'ID do produto é obrigatório' });
            }

            console.log(`Adicionando produto ${produto_id} ao carrinho da sessão ${sessao_id}`);

            // Verificar se produto existe
            const produto = await produtoRepository.buscarPorId(produto_id);
            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            // Verificar estoque
            if (!produto.temEstoque(quantidade)) {
                return res.status(400).json({ error: 'Estoque insuficiente' });
            }

            // Adicionar ao carrinho
            const item = await carrinhoRepository.adicionarItem(produto_id, quantidade, sessao_id);

            res.json({
                success: true,
                message: 'Produto adicionado ao carrinho',
                item: item.toJSON()
            });

        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async obterCarrinho(req, res) {
        try {
            const sessao_id = this.getSessionId(req);

            console.log(`Buscando carrinho para sessão ${sessao_id}`);

            const carrinho = await carrinhoRepository.buscarPorSessao(sessao_id);

            res.json(carrinho.toJSON());

        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async atualizarQuantidade(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;
            const sessao_id = this.getSessionId(req);

            if (!quantidade || quantidade < 1) {
                return res.status(400).json({ error: 'Quantidade inválida' });
            }

            console.log(`Atualizando item ${id} para quantidade ${quantidade}`);

            const sucesso = await carrinhoRepository.atualizarQuantidade(id, quantidade, sessao_id);

            if (!sucesso) {
                return res.status(404).json({ error: 'Item não encontrado no carrinho' });
            }

            res.json({ success: true, message: 'Quantidade atualizada' });

        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async removerItem(req, res) {
        try {
            const { id } = req.params;
            const sessao_id = this.getSessionId(req);

            console.log(`Removendo item ${id} do carrinho da sessão ${sessao_id}`);

            const sucesso = await carrinhoRepository.removerItem(id, sessao_id);

            if (!sucesso) {
                return res.status(404).json({ error: 'Item não encontrado no carrinho' });
            }

            res.json({ success: true, message: 'Produto removido do carrinho' });

        } catch (error) {
            console.error('Erro ao remover produto:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async limparCarrinho(req, res) {
        try {
            const sessao_id = this.getSessionId(req);

            console.log(`Limpando carrinho da sessão ${sessao_id}`);

            const itensRemovidos = await carrinhoRepository.limparCarrinho(sessao_id);

            res.json({ 
                success: true, 
                message: 'Carrinho limpo com sucesso',
                itens_removidos: itensRemovidos
            });

        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async obterResumo(req, res) {
        try {
            const sessao_id = this.getSessionId(req);

            const resumo = await carrinhoRepository.obterResumo(sessao_id);

            res.json(resumo);

        } catch (error) {
            console.error('Erro ao carregar resumo do carrinho:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async finalizarCompra(req, res) {
        try {
            const sessao_id = this.getSessionId(req);
            const { forma_pagamento, endereco_entrega } = req.body;

            if (!forma_pagamento || !endereco_entrega) {
                return res.status(400).json({ error: 'Forma de pagamento e endereço são obrigatórios' });
            }

            console.log(`Finalizando compra para sessão ${sessao_id}`);

            // Obter carrinho
            const carrinho = await carrinhoRepository.buscarPorSessao(sessao_id);

            if (carrinho.itens.length === 0) {
                return res.status(400).json({ error: 'Carrinho vazio' });
            }

            const total = carrinho.calcularTotal();

            // Criar pedido (se a tabela existir)
            try {
                const pedidoRepository = require('../repositories/PedidoRepository');
                await pedidoRepository.criar({
                    sessao_id,
                    total,
                    forma_pagamento,
                    endereco_entrega,
                    status: 'pendente'
                });
            } catch (pedidoError) {
                console.warn('Aviso: Não foi possível criar pedido na tabela de pedidos');
            }

            // Reduzir estoque dos produtos
            for (const item of carrinho.itens) {
                await produtoRepository.reduzirEstoque(item.produto_id, item.quantidade);
            }

            // Limpar carrinho
            await carrinhoRepository.limparCarrinho(sessao_id);

            res.json({
                success: true,
                message: 'Compra finalizada com sucesso',
                total: total.toFixed(2)
            });

        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new CarrinhoController();