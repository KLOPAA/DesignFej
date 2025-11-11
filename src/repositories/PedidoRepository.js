const Pedido = require('../models/Pedido');
const db = require('../../db');

class PedidoRepository {
    async criar(dadosPedido) {
        return new Promise((resolve, reject) => {
            const { sessao_id, total, forma_pagamento, endereco_entrega, status } = dadosPedido;
            
            const pedido = new Pedido(null, sessao_id, total, forma_pagamento, endereco_entrega, status);
            const erros = pedido.validar();
            
            if (erros.length > 0) {
                return reject(new Error(erros.join(', ')));
            }

            const sql = 'INSERT INTO pedidos (sessao_id, total, forma_pagamento, endereco_entrega, status) VALUES (?, ?, ?, ?, ?)';
            
            db.query(sql, [sessao_id, total, forma_pagamento, JSON.stringify(endereco_entrega), status], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                pedido.id = result.insertId;
                resolve(pedido);
            });
        });
    }

    async buscarPorId(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM pedidos WHERE id = ?';
            
            db.query(sql, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length === 0) {
                    return resolve(null);
                }
                
                const dados = results[0];
                let endereco_entrega;
                
                try {
                    endereco_entrega = typeof dados.endereco_entrega === 'string' 
                        ? JSON.parse(dados.endereco_entrega) 
                        : dados.endereco_entrega;
                } catch (e) {
                    endereco_entrega = dados.endereco_entrega;
                }
                
                const pedido = new Pedido(
                    dados.id,
                    dados.sessao_id,
                    dados.total,
                    dados.forma_pagamento,
                    endereco_entrega,
                    dados.status
                );
                
                resolve(pedido);
            });
        });
    }

    async listarTodos() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM pedidos ORDER BY created_at DESC';
            
            db.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const pedidos = results.map(dados => {
                    let endereco_entrega;
                    
                    try {
                        endereco_entrega = typeof dados.endereco_entrega === 'string' 
                            ? JSON.parse(dados.endereco_entrega) 
                            : dados.endereco_entrega;
                    } catch (e) {
                        endereco_entrega = dados.endereco_entrega;
                    }
                    
                    return new Pedido(
                        dados.id,
                        dados.sessao_id,
                        dados.total,
                        dados.forma_pagamento,
                        endereco_entrega,
                        dados.status
                    );
                });
                
                resolve(pedidos);
            });
        });
    }

    async buscarPorSessao(sessao_id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM pedidos WHERE sessao_id = ? ORDER BY created_at DESC';
            
            db.query(sql, [sessao_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const pedidos = results.map(dados => {
                    let endereco_entrega;
                    
                    try {
                        endereco_entrega = typeof dados.endereco_entrega === 'string' 
                            ? JSON.parse(dados.endereco_entrega) 
                            : dados.endereco_entrega;
                    } catch (e) {
                        endereco_entrega = dados.endereco_entrega;
                    }
                    
                    return new Pedido(
                        dados.id,
                        dados.sessao_id,
                        dados.total,
                        dados.forma_pagamento,
                        endereco_entrega,
                        dados.status
                    );
                });
                
                resolve(pedidos);
            });
        });
    }

    async buscarPorStatus(status) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM pedidos WHERE status = ? ORDER BY created_at DESC';
            
            db.query(sql, [status], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const pedidos = results.map(dados => {
                    let endereco_entrega;
                    
                    try {
                        endereco_entrega = typeof dados.endereco_entrega === 'string' 
                            ? JSON.parse(dados.endereco_entrega) 
                            : dados.endereco_entrega;
                    } catch (e) {
                        endereco_entrega = dados.endereco_entrega;
                    }
                    
                    return new Pedido(
                        dados.id,
                        dados.sessao_id,
                        dados.total,
                        dados.forma_pagamento,
                        endereco_entrega,
                        dados.status
                    );
                });
                
                resolve(pedidos);
            });
        });
    }

    async atualizarStatus(id, novoStatus) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
            
            db.query(sql, [novoStatus, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                
                this.buscarPorId(id).then(resolve).catch(reject);
            });
        });
    }

    async excluir(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM pedidos WHERE id = ?';
            
            db.query(sql, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }

    async obterEstatisticas() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    COUNT(*) as total_pedidos,
                    SUM(total) as valor_total,
                    AVG(total) as valor_medio,
                    status,
                    COUNT(*) as quantidade_por_status
                FROM pedidos 
                GROUP BY status
            `;
            
            db.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(results);
            });
        });
    }
}

module.exports = new PedidoRepository();