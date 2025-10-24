const { NotificationManager } = require('../patterns/Observer');
const produtoRepository = require('../repositories/ProdutoRepository');
const db = require('../../db');

class CompraController {
    constructor() {
        this.notificationManager = new NotificationManager();
    }

    async finalizarCompra(req, res) {
        try {
            const { itens, nomeUsuario, tipoPagamento, valorTotal } = req.body;
            
            // Processa a compra e atualiza estoque no banco
            const itensProcessados = await this.processarItensCompra(itens);
            
            // Salva o pedido no banco
            const numeroPedido = await this.salvarPedido({
                valorTotal: valorTotal || 0,
                frete: 15.90,
                tipoPagamento,
                nomeUsuario
            });
            
            // Notifica observers sobre a compra realizada
            this.notificationManager.notificarCompraRealizada(itensProcessados);
            
            res.json({ 
                success: true, 
                message: 'Compra finalizada com sucesso',
                numeroPedido,
                itens: itensProcessados 
            });
            
        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao finalizar compra' 
            });
        }
    }

    async processarItensCompra(itens) {
        const itensProcessados = [];
        
        for (const item of itens) {
            const produto = await produtoRepository.buscarPorId(item.produtoId);
            
            if (!produto) {
                throw new Error(`Produto ${item.produtoId} não encontrado`);
            }
            
            if (produto.estoque < item.quantidade) {
                throw new Error(`Estoque insuficiente para ${produto.nome}`);
            }
            
            // Atualiza estoque no banco
            const novoEstoque = produto.estoque - item.quantidade;
            await produtoRepository.atualizarEstoque(item.produtoId, novoEstoque);
            
            itensProcessados.push({
                produto: {
                    id: produto.id,
                    nome: produto.nome,
                    estoque: novoEstoque
                },
                quantidade: item.quantidade
            });
            
            // Verifica se estoque ficou baixo
            if (novoEstoque <= 5) {
                this.notificationManager.notificarEstoqueBaixo({
                    id: produto.id,
                    nome: produto.nome,
                    estoque: novoEstoque
                });
            }
        }
        
        return itensProcessados;
    }

    async salvarPedido(dadosPedido) {
        return new Promise((resolve, reject) => {
            // Gerar número no formato #95 6098
            const timestamp = Date.now().toString();
            const numeroPedido = '#' + timestamp.slice(-8, -4) + ' ' + timestamp.slice(-4);
            const { valorTotal, frete, tipoPagamento, nomeUsuario } = dadosPedido;
            
            const sql = 'INSERT INTO pedidos (numero_pedido, valor_total, frete, tipo_pagamento, nome_usuario) VALUES (?, ?, ?, ?, ?)';
            
            db.query(sql, [numeroPedido, valorTotal, frete, tipoPagamento, nomeUsuario], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(numeroPedido);
            });
        });
    }
}

module.exports = CompraController;