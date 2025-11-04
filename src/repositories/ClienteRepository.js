const Cliente = require('../models/Cliente');
const DatabaseConnection = require('../config/DatabaseConnection');

class ClienteRepository {
    constructor() {
        this.db = DatabaseConnection.getInstance();
    }

    async criar(dadosCliente) {
        return new Promise((resolve, reject) => {
            const { nome, email, senha_hash, endereco } = dadosCliente;
            
            const cliente = new Cliente(null, nome, email, senha_hash, endereco);
            const erros = cliente.validar();
            
            if (erros.length > 0) {
                return reject(new Error(erros.join(', ')));
            }

            const sql = 'INSERT INTO cadastro (nome, email, senha_hash, endereco) VALUES (?, ?, ?, ?)';
            
            this.db.getConnection().query(sql, [nome, email, senha_hash, endereco], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                cliente.id = result.insertId;
                resolve(cliente);
            });
        });
    }

    async buscarPorId(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cadastro WHERE id = ?';
            
            this.db.getConnection().query(sql, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length === 0) {
                    return resolve(null);
                }
                
                const dados = results[0];
                const cliente = new Cliente(
                    dados.id,
                    dados.nome,
                    dados.email,
                    dados.senha_hash,
                    dados.endereco,
                    dados.token_redefinicao,
                    dados.expira_em
                );
                
                resolve(cliente);
            });
        });
    }

    async buscarPorEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cadastro WHERE email = ?';
            
            this.db.getConnection().query(sql, [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length === 0) {
                    return resolve(null);
                }
                
                const dados = results[0];
                const cliente = new Cliente(
                    dados.id,
                    dados.nome,
                    dados.email,
                    dados.senha_hash,
                    dados.endereco,
                    dados.token_redefinicao,
                    dados.expira_em
                );
                
                resolve(cliente);
            });
        });
    }

    async listarTodos() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cadastro ORDER BY nome';
            
            this.db.getConnection().query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const clientes = results.map(dados => new Cliente(
                    dados.id,
                    dados.nome,
                    dados.email,
                    dados.senha_hash,
                    dados.endereco,
                    dados.token_redefinicao,
                    dados.expira_em
                ));
                
                resolve(clientes);
            });
        });
    }

    async atualizar(id, dadosAtualizados) {
        return new Promise((resolve, reject) => {
            const { nome, email, endereco } = dadosAtualizados;
            
            const sql = 'UPDATE cadastro SET nome = ?, email = ?, endereco = ? WHERE id = ?';
            
            this.db.getConnection().query(sql, [nome, email, endereco, id], (err, result) => {
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
            const sql = 'DELETE FROM cadastro WHERE id = ?';
            
            this.db.getConnection().query(sql, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }

    async atualizarTokenRedefinicao(email, token, expiracao) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE cadastro SET token_redefinicao = ?, expira_em = ? WHERE email = ?';
            
            this.db.getConnection().query(sql, [token, expiracao, email], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }

    async buscarPorToken(token) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cadastro WHERE token_redefinicao = ?';
            
            this.db.getConnection().query(sql, [token], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length === 0) {
                    return resolve(null);
                }
                
                const dados = results[0];
                const cliente = new Cliente(
                    dados.id,
                    dados.nome,
                    dados.email,
                    dados.senha_hash,
                    dados.endereco,
                    dados.token_redefinicao,
                    dados.expira_em
                );
                
                resolve(cliente);
            });
        });
    }

    async atualizarSenha(id, novaSenhaHash) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE cadastro SET senha_hash = ?, token_redefinicao = NULL, expira_em = NULL WHERE id = ?';
            
            this.db.getConnection().query(sql, [novaSenhaHash, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }
}

module.exports = new ClienteRepository();