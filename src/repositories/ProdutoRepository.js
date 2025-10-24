const Produto = require('../models/Produto');
const db = require('../../db');

class ProdutoRepository {
    async criar(dadosProduto) {
        return new Promise((resolve, reject) => {
            const { nome, descricao, preco, imagem, categoria, estoque } = dadosProduto;
            
            const produto = new Produto(null, nome, descricao, preco, imagem, categoria, estoque);
            const erros = produto.validar();
            
            if (erros.length > 0) {
                return reject(new Error(erros.join(', ')));
            }

            const sql = 'INSERT INTO produtos (nome, descricao, preco, imagem, categoria, estoque) VALUES (?, ?, ?, ?, ?, ?)';
            
            db.query(sql, [nome, descricao, preco, imagem, categoria, estoque], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                produto.id = result.insertId;
                resolve(produto);
            });
        });
    }

    async buscarPorId(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM produtos WHERE id = ?';
            
            db.query(sql, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length === 0) {
                    return resolve(null);
                }
                
                const dados = results[0];
                const produto = new Produto(
                    dados.id,
                    dados.nome,
                    dados.descricao,
                    dados.preco,
                    dados.imagem,
                    dados.categoria,
                    dados.estoque
                );
                
                resolve(produto);
            });
        });
    }

    async listarTodos() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM produtos ORDER BY nome';
            
            db.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const produtos = results.map(dados => new Produto(
                    dados.id,
                    dados.nome,
                    dados.descricao,
                    dados.preco,
                    dados.imagem,
                    dados.categoria,
                    dados.estoque
                ));
                
                resolve(produtos);
            });
        });
    }

    async buscarPorCategoria(categoria) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM produtos WHERE categoria LIKE ? ORDER BY nome';
            
            db.query(sql, [`%${categoria}%`], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const produtos = results.map(dados => new Produto(
                    dados.id,
                    dados.nome,
                    dados.descricao,
                    dados.preco,
                    dados.imagem,
                    dados.categoria,
                    dados.estoque
                ));
                
                resolve(produtos);
            });
        });
    }

    async buscarPorNome(nome) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM produtos WHERE nome LIKE ? ORDER BY nome';
            
            db.query(sql, [`%${nome}%`], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const produtos = results.map(dados => new Produto(
                    dados.id,
                    dados.nome,
                    dados.descricao,
                    dados.preco,
                    dados.imagem,
                    dados.categoria,
                    dados.estoque
                ));
                
                resolve(produtos);
            });
        });
    }

    async atualizar(id, dadosAtualizados) {
        return new Promise((resolve, reject) => {
            const { nome, descricao, preco, imagem, categoria, estoque } = dadosAtualizados;
            
            const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem = ?, categoria = ?, estoque = ? WHERE id = ?';
            
            db.query(sql, [nome, descricao, preco, imagem, categoria, estoque, id], (err, result) => {
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
            const sql = 'DELETE FROM produtos WHERE id = ?';
            
            db.query(sql, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }

    async atualizarEstoque(id, novoEstoque) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE produtos SET estoque = ? WHERE id = ?';
            
            db.query(sql, [novoEstoque, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }

    async reduzirEstoque(id, quantidade) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE produtos SET estoque = estoque - ? WHERE id = ? AND estoque >= ?';
            
            db.query(sql, [quantidade, id, quantidade], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }
}

module.exports = new ProdutoRepository();