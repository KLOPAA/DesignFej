const fs = require('fs');
const path = require('path');
const DatabaseConnection = require('../config/DatabaseConnection');

class BackupService {
    constructor() {
        this.db = DatabaseConnection.getInstance();
        this.backupDir = path.join(__dirname, '../../backups');
        this.ensureBackupDir();
    }

    ensureBackupDir() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    async criarBackup() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `backup_designfej_${timestamp}.sql`;
            const filepath = path.join(this.backupDir, filename);

            const tabelas = ['cadastro', 'produtos', 'pedidos', 'itens_pedido', 'carrinho', 'avaliacoes', 'cupons', 'wishlist'];
            let sqlContent = `-- Backup DesignFej - ${new Date().toLocaleString()}\n\n`;

            for (const tabela of tabelas) {
                try {
                    const dados = await this.exportarTabela(tabela);
                    sqlContent += dados + '\n\n';
                } catch (error) {
                    console.log(`⚠️ Tabela ${tabela} não encontrada, pulando...`);
                }
            }

            fs.writeFileSync(filepath, sqlContent, 'utf8');
            
            console.log(`✅ Backup criado: ${filename}`);
            this.limparBackupsAntigos();
            
            return {
                sucesso: true,
                arquivo: filename,
                caminho: filepath,
                tamanho: this.formatarTamanho(fs.statSync(filepath).size)
            };

        } catch (error) {
            console.error('❌ Erro ao criar backup:', error.message);
            return {
                sucesso: false,
                erro: error.message
            };
        }
    }

    async exportarTabela(nomeTabela) {
        return new Promise((resolve, reject) => {
            // Primeiro, obter a estrutura da tabela
            this.db.getConnection().query(`SHOW CREATE TABLE ${nomeTabela}`, (err, results) => {
                if (err) {
                    return reject(err);
                }

                let sql = `-- Estrutura da tabela ${nomeTabela}\n`;
                sql += `DROP TABLE IF EXISTS ${nomeTabela};\n`;
                sql += results[0]['Create Table'] + ';\n\n';

                // Depois, obter os dados
                this.db.getConnection().query(`SELECT * FROM ${nomeTabela}`, (err, dados) => {
                    if (err) {
                        return reject(err);
                    }

                    if (dados.length > 0) {
                        sql += `-- Dados da tabela ${nomeTabela}\n`;
                        
                        const colunas = Object.keys(dados[0]);
                        const valoresInsert = dados.map(linha => {
                            const valores = colunas.map(coluna => {
                                const valor = linha[coluna];
                                if (valor === null) return 'NULL';
                                if (typeof valor === 'string') {
                                    return `'${valor.replace(/'/g, "''")}'`;
                                }
                                if (valor instanceof Date) {
                                    return `'${valor.toISOString().slice(0, 19).replace('T', ' ')}'`;
                                }
                                return valor;
                            });
                            return `(${valores.join(', ')})`;
                        });

                        const insertSQL = `INSERT INTO ${nomeTabela} (${colunas.join(', ')}) VALUES\n${valoresInsert.join(',\n')};\n`;
                        sql += insertSQL;
                    }

                    resolve(sql);
                });
            });
        });
    }

    limparBackupsAntigos() {
        try {
            const arquivos = fs.readdirSync(this.backupDir);
            const backups = arquivos
                .filter(arquivo => arquivo.startsWith('backup_designfej_'))
                .map(arquivo => ({
                    nome: arquivo,
                    caminho: path.join(this.backupDir, arquivo),
                    data: fs.statSync(path.join(this.backupDir, arquivo)).mtime
                }))
                .sort((a, b) => b.data - a.data);

            // Manter apenas os 10 backups mais recentes
            if (backups.length > 10) {
                const paraRemover = backups.slice(10);
                paraRemover.forEach(backup => {
                    fs.unlinkSync(backup.caminho);
                    console.log(`🗑️ Backup antigo removido: ${backup.nome}`);
                });
            }
        } catch (error) {
            console.error('⚠️ Erro ao limpar backups antigos:', error.message);
        }
    }

    listarBackups() {
        try {
            const arquivos = fs.readdirSync(this.backupDir);
            return arquivos
                .filter(arquivo => arquivo.startsWith('backup_designfej_'))
                .map(arquivo => {
                    const caminho = path.join(this.backupDir, arquivo);
                    const stats = fs.statSync(caminho);
                    return {
                        nome: arquivo,
                        data: stats.mtime,
                        tamanho: this.formatarTamanho(stats.size)
                    };
                })
                .sort((a, b) => b.data - a.data);
        } catch (error) {
            console.error('❌ Erro ao listar backups:', error.message);
            return [];
        }
    }

    formatarTamanho(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    agendarBackupAutomatico() {
        // Backup automático a cada 24 horas
        setInterval(() => {
            console.log('🔄 Iniciando backup automático...');
            this.criarBackup();
        }, 24 * 60 * 60 * 1000); // 24 horas em millisegundos
    }
}

module.exports = BackupService;