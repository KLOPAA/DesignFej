const { ItemCarrinho, Carrinho } = require('../models/Carrinho');
const Produto = require('../models/Produto');
const db = require('../../db');

class CarrinhoRepository {
    async adicionarItem(produto_id, quantidade, sessao_id) {
        return new Promise((resolve, reject) => {
            // Verificar se item já existe no carrinho
            const checkSql = 'SELECT * FROM carrinho WHERE produto_id = ? AND sessao_id = ?';
            
            db.query(checkSql, [produto_id, sessao_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length > 0) {
                    // Atualizar quantidade existente
                    const updateSql = 'UPDATE carrinho SET quantidade = quantidade + ?, updated_at = NOW() WHERE id = ?';
                    
                    db.query(updateSql, [quantidade, results[0].id], (updateErr, updateResult) => {
                        if (updateErr) {
                            return reject(updateErr);
                        }
                        
                        this.buscarItemPorId(results[0].id).then(resolve).catch(reject);
                    });
                } else {
                    // Inserir novo item
                    const insertSql = 'INSERT INTO carrinho (produto_id, quantidade, sessao_id) VALUES (?, ?, ?)';
                    
                    db.query(insertSql, [produto_id, quantidade, sessao_id], (insertErr, insertResult) => {
                        if (insertErr) {
                            return reject(insertErr);
                        }
                        
                        this.buscarItemPorId(insertResult.insertId).then(resolve).catch(reject);
                    });
                }
            });
        });
    }

    async buscarItemPorId(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT c.*, p.nome, p.descricao, p.preco, p.imagem, p.categoria, p.estoque
                FROM carrinho c 
                INNER JOIN produtos p ON c.produto_id = p.id 
                WHERE c.id = ?
            `;
            
            db.query(sql, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length === 0) {
                    return resolve(null);
                }
                
                const dados = results[0];
                const produto = new Produto(
                    dados.produto_id,
                    dados.nome,
                    dados.descricao,
                    dados.preco,
                    dados.imagem,
                    dados.categoria,
                    dados.estoque
                );
                
                const item = new ItemCarrinho(
                    dados.id,
                    dados.produto_id,
                    dados.quantidade,
                    dados.sessao_id,
                    produto
                );
                
                resolve(item);
            });
        });
    }

    async buscarPorSessao(sessao_id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT c.*, p.nome, p.descricao, p.preco, p.imagem, p.categoria, p.estoque,
                       (c.quantidade * p.preco) as total_item
                FROM carrinho c 
                INNER JOIN produtos p ON c.produto_id = p.id 
                WHERE c.sessao_id = ?
                ORDER BY c.created_at DESC
            `;
            
            db.query(sql, [sessao_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const carrinho = new Carrinho(sessao_id);
                
                results.forEach(dados => {
                    const produto = new Produto(
                        dados.produto_id,
                        dados.nome,
                        dados.descricao,
                        dados.preco,
                        dados.imagem,
                        dados.categoria,
                        dados.estoque
                    );
                    
                    const item = new ItemCarrinho(
                        dados.id,
                        dados.produto_id,
                        dados.quantidade,
                        dados.sessao_id,
                        produto
                    );
                    
                    carrinho.adicionarItem(item);
                });
                
                resolve(carrinho);
            });
        });
    }

    async atualizarQuantidade(id, quantidade, sessao_id) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE carrinho SET quantidade = ?, updated_at = NOW() WHERE id = ? AND sessao_id = ?';
            
            db.query(sql, [quantidade, id, sessao_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }

    async removerItem(id, sessao_id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM carrinho WHERE id = ? AND sessao_id = ?';
            
            db.query(sql, [id, sessao_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }

    async limparCarrinho(sessao_id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM carrinho WHERE sessao_id = ?';
            
            db.query(sql, [sessao_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows);
            });
        });
    }

    async obterResumo(sessao_id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    COUNT(*) as total_itens,
                    SUM(c.quantidade) as quantidade_total,
                    SUM(c.quantidade * p.preco) as valor_total
                FROM carrinho c 
                INNER JOIN produtos p ON c.produto_id = p.id 
                WHERE c.sessao_id = ?
            `;
            
            db.query(sql, [sessao_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const resumo = results[0] || {
                    total_itens: 0,
                    quantidade_total: 0,
                    valor_total: 0
                };
                
                resolve({
                    total_itens: parseInt(resumo.total_itens) || 0,
                    quantidade_total: parseInt(resumo.quantidade_total) || 0,
                    valor_total: parseFloat(resumo.valor_total) || 0
                });
            });
        });
    }
}

module.exports = new CarrinhoRepository();