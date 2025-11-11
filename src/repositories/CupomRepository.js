const Cupom = require('../models/Cupom');
const DatabaseConnection = require('../config/DatabaseConnection');

class CupomRepository {
    constructor() {
        this.db = DatabaseConnection.getInstance();
    }

    async criar(dadosCupom) {
        return new Promise((resolve, reject) => {
            const { codigo, tipo, valor, data_inicio, data_fim } = dadosCupom;
            
            const cupom = new Cupom(null, codigo, tipo, valor, data_inicio, data_fim);
            const erros = cupom.validar();
            
            if (erros.length > 0) {
                return reject(new Error(erros.join(', ')));
            }

            const sql = 'INSERT INTO cupons (codigo, tipo, valor, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?)';
            
            this.db.getConnection().query(sql, [codigo, tipo, valor, data_inicio, data_fim], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                cupom.id = result.insertId;
                resolve(cupom);
            });
        });
    }

    async buscarPorCodigo(codigo) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cupons WHERE codigo = ?';
            
            this.db.getConnection().query(sql, [codigo.toUpperCase()], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length === 0) {
                    return resolve(null);
                }
                
                const dados = results[0];
                const cupom = new Cupom(
                    dados.id,
                    dados.codigo,
                    dados.tipo,
                    dados.valor,
                    dados.data_inicio,
                    dados.data_fim,
                    dados.ativo,
                    dados.usado
                );
                
                resolve(cupom);
            });
        });
    }

    async listarAtivos() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cupons WHERE ativo = 1 AND usado = 0 ORDER BY data_fim ASC';
            
            this.db.getConnection().query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const cupons = results.map(dados => new Cupom(
                    dados.id,
                    dados.codigo,
                    dados.tipo,
                    dados.valor,
                    dados.data_inicio,
                    dados.data_fim,
                    dados.ativo,
                    dados.usado
                ));
                
                resolve(cupons);
            });
        });
    }

    async marcarComoUsado(id) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE cupons SET usado = 1 WHERE id = ?';
            
            this.db.getConnection().query(sql, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }

<<<<<<< HEAD
    async listarTodos() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cupons ORDER BY data_fim ASC';
            
            this.db.getConnection().query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const cupons = results.map(dados => new Cupom(
                    dados.id,
                    dados.codigo,
                    dados.tipo,
                    dados.valor,
                    dados.data_inicio,
                    dados.data_fim,
                    dados.ativo,
                    dados.usado
                ));
                
                resolve(cupons);
            });
        });
    }

=======
>>>>>>> edb44139fc1678797acca79fc165df932d43a4c2
    async desativar(id) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE cupons SET ativo = 0 WHERE id = ?';
            
            this.db.getConnection().query(sql, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result.affectedRows > 0);
            });
        });
    }
}

module.exports = new CupomRepository();