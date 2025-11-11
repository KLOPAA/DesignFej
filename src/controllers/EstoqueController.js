const db = require('../../db');

class EstoqueController {
    async obterEstoque(req, res) {
        try {
            const produtos = await this.buscarTodosProdutos();
            
            res.json({
                success: true,
                produtos: produtos
            });

        } catch (error) {
            console.error('[ERRO] Erro ao obter estoque:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao buscar estoque' 
            });
        }
    }

    async atualizarEstoque(req, res) {
        try {
            const { id } = req.params;
            const { estoque } = req.body;

            if (estoque === undefined || estoque < 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Quantidade de estoque inválida' 
                });
            }

            await this.executarQuery(
                'UPDATE produtos SET estoque = ? WHERE id = ?',
                [estoque, id]
            );

            res.json({
                success: true,
                message: 'Estoque atualizado com sucesso!'
            });

        } catch (error) {
            console.error('[ERRO] Erro ao atualizar estoque:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao atualizar estoque' 
            });
        }
    }

    async verificarEstoqueBaixo(req, res) {
        try {
            const limite = req.query.limite || 5;
            
            const produtos = await this.executarQuery(
                'SELECT id, nome, estoque, categoria FROM produtos WHERE estoque <= ? ORDER BY estoque ASC',
                [limite]
            );

            res.json({
                success: true,
                produtos: produtos,
                total: produtos.length
            });

        } catch (error) {
            console.error('[ERRO] Erro ao verificar estoque baixo:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao verificar estoque baixo' 
            });
        }
    }

    async adicionarEstoque(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;

            if (!quantidade || quantidade <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Quantidade deve ser maior que zero' 
                });
            }

            await this.executarQuery(
                'UPDATE produtos SET estoque = estoque + ? WHERE id = ?',
                [quantidade, id]
            );

            // Buscar estoque atualizado
            const produto = await this.executarQuery(
                'SELECT nome, estoque FROM produtos WHERE id = ?',
                [id]
            );

            res.json({
                success: true,
                message: `Estoque adicionado com sucesso!`,
                produto: produto[0]
            });

        } catch (error) {
            console.error('[ERRO] Erro ao adicionar estoque:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao adicionar estoque' 
            });
        }
    }

    async removerEstoque(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;

            if (!quantidade || quantidade <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Quantidade deve ser maior que zero' 
                });
            }

            // Verificar se há estoque suficiente
            const produto = await this.executarQuery(
                'SELECT nome, estoque FROM produtos WHERE id = ?',
                [id]
            );

            if (!produto.length) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Produto não encontrado' 
                });
            }

            if (produto[0].estoque < quantidade) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Estoque insuficiente para remoção' 
                });
            }

            await this.executarQuery(
                'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
                [quantidade, id]
            );

            // Buscar estoque atualizado
            const produtoAtualizado = await this.executarQuery(
                'SELECT nome, estoque FROM produtos WHERE id = ?',
                [id]
            );

            res.json({
                success: true,
                message: `Estoque removido com sucesso!`,
                produto: produtoAtualizado[0]
            });

        } catch (error) {
            console.error('[ERRO] Erro ao remover estoque:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao remover estoque' 
            });
        }
    }

    async obterHistoricoMovimentacao(req, res) {
        try {
            // Esta funcionalidade pode ser implementada futuramente com uma tabela de histórico
            res.json({
                success: true,
                message: 'Funcionalidade de histórico será implementada em breve',
                historico: []
            });

        } catch (error) {
            console.error('[ERRO] Erro ao obter histórico:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao obter histórico' 
            });
        }
    }

    // Métodos auxiliares
    async buscarTodosProdutos() {
        return this.executarQuery(
            'SELECT id, nome, descricao, preco, imagem, categoria, estoque FROM produtos ORDER BY nome ASC'
        );
    }

    async executarQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            db.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = EstoqueController;