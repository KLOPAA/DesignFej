const db = require('../../db');

class CompraController {
    async finalizarCompra(req, res) {
        try {
            const { itens, nomeUsuario, tipoPagamento, valorTotal } = req.body;

            if (!itens || !nomeUsuario || !tipoPagamento || !valorTotal) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Dados incompletos para finalizar a compra' 
                });
            }

            // Buscar usuário pelo nome (temporário - idealmente seria por ID de sessão)
            const usuario = await this.buscarUsuarioPorNome(nomeUsuario);
            if (!usuario) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Usuário não encontrado' 
                });
            }

            // Gerar número do pedido
            const numeroPedido = this.gerarNumeroPedido();
            const codigoRastreamento = this.gerarCodigoRastreamento();

            // Iniciar transação
            await this.executarTransacao(async (connection) => {
                // Inserir pedido
                const resultPedido = await this.executarQuery(connection,
                    `INSERT INTO pedidos (numero_pedido, id_usuario, valor_total, frete, tipo_pagamento, codigo_rastreamento) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [numeroPedido, usuario.id, valorTotal, 15.90, tipoPagamento, codigoRastreamento]
                );

                const idPedido = resultPedido.insertId;

                // Inserir itens do pedido e atualizar estoque
                for (const item of itens) {
                    // Verificar estoque
                    const produto = await this.executarQuery(connection,
                        'SELECT estoque, preco FROM produtos WHERE id = ?',
                        [item.produtoId]
                    );

                    if (!produto.length || produto[0].estoque < item.quantidade) {
                        throw new Error(`Estoque insuficiente para o produto ID ${item.produtoId}`);
                    }

                    // Inserir item do pedido
                    await this.executarQuery(connection,
                        `INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco_unitario) 
                         VALUES (?, ?, ?, ?)`,
                        [idPedido, item.produtoId, item.quantidade, produto[0].preco]
                    );

                    // Atualizar estoque
                    await this.executarQuery(connection,
                        'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
                        [item.quantidade, item.produtoId]
                    );
                }

                // Inserir rastreamento inicial
                await this.executarQuery(connection,
                    `INSERT INTO rastreamento (id_pedido, status, descricao) 
                     VALUES (?, ?, ?)`,
                    [idPedido, 'Confirmado', 'Pedido confirmado e aguardando preparação']
                );
            });

            res.json({
                success: true,
                numeroPedido: numeroPedido,
                codigoRastreamento: codigoRastreamento,
                message: 'Pedido finalizado com sucesso!'
            });

        } catch (error) {
            console.error('[ERRO] Erro ao finalizar compra:', error.message);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Erro interno do servidor' 
            });
        }
    }

    async buscarUsuarioPorNome(nome) {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, nome FROM cadastro WHERE nome = ?', [nome], (err, results) => {
                if (err) return reject(err);
                resolve(results.length > 0 ? results[0] : null);
            });
        });
    }

    async obterPedidosUsuario(req, res) {
        try {
            const { nomeUsuario } = req.query;

            if (!nomeUsuario) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Nome do usuário é obrigatório' 
                });
            }

            const usuario = await this.buscarUsuarioPorNome(nomeUsuario);
            if (!usuario) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Usuário não encontrado' 
                });
            }

            const pedidos = await this.buscarPedidosComItens(usuario.id);

            res.json({
                success: true,
                pedidos: pedidos
            });

        } catch (error) {
            console.error('[ERRO] Erro ao obter pedidos:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao buscar pedidos' 
            });
        }
    }

    async buscarPedidosComItens(idUsuario) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    p.id, p.numero_pedido, p.valor_total, p.frete, p.tipo_pagamento, 
                    p.status, p.codigo_rastreamento, p.data_pedido,
                    ip.quantidade, ip.preco_unitario,
                    pr.nome as produto_nome, pr.imagem as produto_imagem
                FROM pedidos p
                LEFT JOIN itens_pedido ip ON p.id = ip.id_pedido
                LEFT JOIN produtos pr ON ip.id_produto = pr.id
                WHERE p.id_usuario = ?
                ORDER BY p.data_pedido DESC
            `;

            db.query(query, [idUsuario], (err, results) => {
                if (err) return reject(err);

                // Agrupar resultados por pedido
                const pedidosMap = new Map();

                results.forEach(row => {
                    if (!pedidosMap.has(row.id)) {
                        pedidosMap.set(row.id, {
                            id: row.id,
                            numero_pedido: row.numero_pedido,
                            valor_total: row.valor_total,
                            frete: row.frete,
                            tipo_pagamento: row.tipo_pagamento,
                            status: row.status,
                            codigo_rastreamento: row.codigo_rastreamento,
                            data_pedido: row.data_pedido,
                            itens: []
                        });
                    }

                    if (row.produto_nome) {
                        pedidosMap.get(row.id).itens.push({
                            nome: row.produto_nome,
                            quantidade: row.quantidade,
                            preco_unitario: row.preco_unitario,
                            imagem: row.produto_imagem
                        });
                    }
                });

                resolve(Array.from(pedidosMap.values()));
            });
        });
    }

    async atualizarStatusPedido(req, res) {
        try {
            const { id } = req.params;
            const { status, descricao } = req.body;

            if (!status) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Status é obrigatório' 
                });
            }

            // Atualizar status do pedido
            await this.executarQuery(null,
                'UPDATE pedidos SET status = ? WHERE id = ?',
                [status, id]
            );

            // Inserir no rastreamento
            await this.executarQuery(null,
                `INSERT INTO rastreamento (id_pedido, status, descricao) 
                 VALUES (?, ?, ?)`,
                [id, status, descricao || `Status atualizado para ${status}`]
            );

            res.json({
                success: true,
                message: 'Status atualizado com sucesso!'
            });

        } catch (error) {
            console.error('[ERRO] Erro ao atualizar status:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao atualizar status' 
            });
        }
    }

    async obterRastreamento(req, res) {
        try {
            const { codigo } = req.params;

            const rastreamento = await this.buscarRastreamentoPorCodigo(codigo);

            if (!rastreamento.length) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Código de rastreamento não encontrado' 
                });
            }

            res.json({
                success: true,
                rastreamento: rastreamento
            });

        } catch (error) {
            console.error('[ERRO] Erro ao obter rastreamento:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao buscar rastreamento' 
            });
        }
    }

    async buscarRastreamentoPorCodigo(codigo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT r.status, r.descricao, r.data_atualizacao, p.numero_pedido
                FROM rastreamento r
                JOIN pedidos p ON r.id_pedido = p.id
                WHERE p.codigo_rastreamento = ?
                ORDER BY r.data_atualizacao ASC
            `;

            db.query(query, [codigo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    // Métodos auxiliares
    gerarNumeroPedido() {
        return 'PED' + Date.now().toString().slice(-8);
    }

    gerarCodigoRastreamento() {
        return 'BR' + Math.random().toString().slice(2, 11);
    }

    async executarTransacao(callback) {
        return new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if (err) return reject(err);

                connection.beginTransaction(async (err) => {
                    if (err) {
                        connection.release();
                        return reject(err);
                    }

                    try {
                        await callback(connection);
                        connection.commit((err) => {
                            if (err) {
                                connection.rollback(() => {
                                    connection.release();
                                    reject(err);
                                });
                            } else {
                                connection.release();
                                resolve();
                            }
                        });
                    } catch (error) {
                        connection.rollback(() => {
                            connection.release();
                            reject(error);
                        });
                    }
                });
            });
        });
    }

    async executarQuery(connection, query, params) {
        return new Promise((resolve, reject) => {
            const conn = connection || db;
            conn.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = CompraController;