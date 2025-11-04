const Avaliacao = require('../models/Avaliacao');
const DatabaseConnection = require('../config/DatabaseConnection');

class AvaliacaoRepository {
    constructor() {
        this.db = DatabaseConnection.getInstance();
    }

    async criar(dadosAvaliacao) {
        return new Promise((resolve, reject) => {
            const { cliente_nome, produto_id, nota, comentario } = dadosAvaliacao;
            
            const avaliacao = new Avaliacao(null, cliente_nome, produto_id, nota, comentario);
            const erros = avaliacao.validar();
            
            if (erros.length > 0) {
                return reject(new Error(erros.join(', ')));
            }

            const sql = 'INSERT INTO avaliacoes (cliente_nome, produto_id, nota, comentario) VALUES (?, ?, ?, ?)';
            
            this.db.getConnection().query(sql, [cliente_nome, produto_id, nota, comentario], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                avaliacao.id = result.insertId;
                resolve(avaliacao);
            });
        });
    }

    async buscarPorProduto(produto_id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT a.* 
                FROM avaliacoes a 
                WHERE a.produto_id = ? 
                ORDER BY a.data_avaliacao DESC
            `;
            
            this.db.getConnection().query(sql, [produto_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const avaliacoes = results.map(dados => {
                    const avaliacao = new Avaliacao(
                        dados.id,
                        dados.cliente_nome,
                        dados.produto_id,
                        dados.nota,
                        dados.comentario,
                        dados.data_avaliacao
                    );
                    return avaliacao;
                });
                
                resolve(avaliacoes);
            });
        });
    }

    async calcularMediaProduto(produto_id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT AVG(nota) as media, COUNT(*) as total FROM avaliacoes WHERE produto_id = ?';
            
            this.db.getConnection().query(sql, [produto_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const resultado = results[0];
                resolve({
                    media: parseFloat(resultado.media || 0).toFixed(1),
                    total: resultado.total
                });
            });
        });
    }

    async listarTodas() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT a.*, p.nome as produto_nome 
                FROM avaliacoes a 
                JOIN produtos p ON a.produto_id = p.id 
                ORDER BY a.data_avaliacao DESC
            `;
            
            this.db.getConnection().query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const avaliacoes = results.map(dados => {
                    const avaliacao = new Avaliacao(
                        dados.id,
                        dados.cliente_nome,
                        dados.produto_id,
                        dados.nota,
                        dados.comentario,
                        dados.data_avaliacao
                    );
                    avaliacao.produto_nome = dados.produto_nome;
                    return avaliacao;
                });
                
                resolve(avaliacoes);
            });
        });
    }
}

module.exports = new AvaliacaoRepository();