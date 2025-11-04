const mysql = require('mysql2');
const dbConfig = require('./database');

class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        
        this.connection = mysql.createConnection(dbConfig);
        this.isConnected = false;
        
        DatabaseConnection.instance = this;
        return this;
    }

    async connect() {
        if (this.isConnected) {
            return this.connection;
        }

        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) {
                    console.error('[ERRO] Conexão com o banco falhou:', err.message);
                    reject(err);
                } else {
                    this.isConnected = true;
                    resolve(this.connection);
                }
            });
        });
    }

    getConnection() {
        if (!this.isConnected) {
            throw new Error('Banco de dados não conectado. Chame connect() primeiro.');
        }
        return this.connection;
    }

    async disconnect() {
        if (this.isConnected) {
            return new Promise((resolve) => {
                this.connection.end(() => {
                    console.log('🔌 Conexão com MySQL encerrada');
                    this.isConnected = false;
                    resolve();
                });
            });
        }
    }

    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
}

module.exports = DatabaseConnection;