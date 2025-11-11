const Wishlist = require('../models/Wishlist');
const DatabaseConnection = require('../config/DatabaseConnection');

class WishlistRepository {
    constructor() {
        this.db = DatabaseConnection.getInstance();
    }

    async adicionar(cliente_id, produto_id) {
        return new Promise((resolve, reject) => {
            const wishlist = new Wishlist(null, cliente_id, produto_id);
            const erros = wishlist.validar();
            
            if (erros.length > 0) {
                return reject(new Error(erros.join(', ')));
            }

            // Verificar se já existe
            const sqlCheck = 'SELECT id FROM wishlist WHERE cliente_id = ? AND produto_id = ?';
            
            this.db.getConnection().query(sqlCheck, [cliente_id, produto_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length > 0) {
                    return reject(new Error('Produto já está na lista de desejos'));
                }

                const sql = 'INSERT INTO wishlist (cliente_id, produto_id) VALUES (?, ?)';
                
                this.db.getConnection().query(sql, [cliente_id, produto_id], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    
                    wishlist.id = result.insertId;
                    resolve(wishlist);
                });
            });
        });
    }

    async buscarPorCliente(cliente_id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT w.*, p.nome, p.preco, p.imagem, p.categoria 
                FROM wishlist w 
                JOIN produtos p ON w.produto_id = p.id 
                WHERE w.cliente_id = ? 
                ORDER BY w.data_adicao DESC
            `;
            
            this.db.getConnection().query(sql, [cliente_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const itens = results.map(dados => {
                    const item = new Wishlist(
                        dados.id,
                        dados.cliente_id,
                        dados.produto_id,
                        dados.data_adicao
                    );
                    item.produto = {
                        nome: dados.nome,
                        preco: dados.preco,
                        imagem: dados.imagem,
                        categoria: dados.categoria
                    };
                    return item;
                });
                
                resolve(itens);
            });
        });
    }

    async remover(cliente_id, produto_id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM wishlist WHERE cliente_id = ? AND produto_id = ?';
            
            this.db.getConnection().query(sql, [cliente_id, produto_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }

    async verificarExiste(cliente_id, produto_id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id FROM wishlist WHERE cliente_id = ? AND produto_id = ?';
            
            this.db.getConnection().query(sql, [cliente_id, produto_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(results.length > 0);
            });
        });
    }

    async contarItens(cliente_id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as total FROM wishlist WHERE cliente_id = ?';
            
            this.db.getConnection().query(sql, [cliente_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(results[0].total);
            });
        });
    }
}

module.exports = new WishlistRepository();