const DatabaseConnection = require('../config/DatabaseConnection');

class BuscaController {
    constructor() {
        this.db = DatabaseConnection.getInstance();
    }

    async buscarProdutos(req, res) {
        try {
            const { termo, categoria, preco_min, preco_max, ordenar } = req.query;

            let sql = 'SELECT * FROM produtos WHERE 1=1';
            const params = [];

            // Filtro por termo de busca
            if (termo) {
                sql += ' AND (nome LIKE ? OR descricao LIKE ?)';
                params.push(`%${termo}%`, `%${termo}%`);
            }

            // Filtro por categoria
            if (categoria && categoria !== 'todas') {
                sql += ' AND categoria = ?';
                params.push(categoria);
            }

            // Filtro por preço mínimo
            if (preco_min) {
                sql += ' AND preco >= ?';
                params.push(parseFloat(preco_min));
            }

            // Filtro por preço máximo
            if (preco_max) {
                sql += ' AND preco <= ?';
                params.push(parseFloat(preco_max));
            }

            // Apenas produtos com estoque
            sql += ' AND estoque > 0';

            // Ordenação
            switch (ordenar) {
                case 'preco_asc':
                    sql += ' ORDER BY preco ASC';
                    break;
                case 'preco_desc':
                    sql += ' ORDER BY preco DESC';
                    break;
                case 'nome':
                    sql += ' ORDER BY nome ASC';
                    break;
                case 'mais_recente':
                    sql += ' ORDER BY created_at DESC';
                    break;
                default:
                    sql += ' ORDER BY nome ASC';
            }

            this.db.getConnection().query(sql, params, (err, results) => {
                if (err) {
                    console.error('[ERRO] Erro na busca:', err);
                    return res.status(500).json({ erro: 'Erro na busca de produtos' });
                }

                res.json({
                    produtos: results,
                    total: results.length,
                    filtros: {
                        termo,
                        categoria,
                        preco_min,
                        preco_max,
                        ordenar
                    }
                });
            });

        } catch (error) {
            console.error('[ERRO] Erro na busca:', error.message);
            res.status(500).json({ erro: 'Erro na busca de produtos' });
        }
    }

    async obterCategorias(req, res) {
        try {
            const sql = 'SELECT DISTINCT categoria FROM produtos WHERE categoria IS NOT NULL ORDER BY categoria';

            this.db.getConnection().query(sql, (err, results) => {
                if (err) {
                    console.error('[ERRO] Erro ao obter categorias:', err);
                    return res.status(500).json({ erro: 'Erro ao obter categorias' });
                }

                const categorias = results.map(row => row.categoria);
                res.json(categorias);
            });

        } catch (error) {
            console.error('[ERRO] Erro ao obter categorias:', error.message);
            res.status(500).json({ erro: 'Erro ao obter categorias' });
        }
    }

    async sugestoesBusca(req, res) {
        try {
            const { termo } = req.query;

            if (!termo || termo.length < 2) {
                return res.json([]);
            }

            const sql = `
                SELECT DISTINCT nome 
                FROM produtos 
                WHERE nome LIKE ? 
                AND estoque > 0 
                ORDER BY nome 
                LIMIT 10
            `;

            this.db.getConnection().query(sql, [`%${termo}%`], (err, results) => {
                if (err) {
                    console.error('[ERRO] Erro nas sugestões:', err);
                    return res.status(500).json({ erro: 'Erro nas sugestões' });
                }

                const sugestoes = results.map(row => row.nome);
                res.json(sugestoes);
            });

        } catch (error) {
            console.error('[ERRO] Erro nas sugestões:', error.message);
            res.status(500).json({ erro: 'Erro nas sugestões de busca' });
        }
    }

    async produtosMaisVistos(req, res) {
        try {
            // Simula produtos mais vistos baseado em avaliações e pedidos
            const sql = `
                SELECT p.*, 
                       COALESCE(AVG(a.nota), 0) as media_avaliacoes,
                       COUNT(DISTINCT a.id) as total_avaliacoes
                FROM produtos p
                LEFT JOIN avaliacoes a ON p.id = a.produto_id
                WHERE p.estoque > 0
                GROUP BY p.id
                ORDER BY total_avaliacoes DESC, media_avaliacoes DESC
                LIMIT 8
            `;

            this.db.getConnection().query(sql, (err, results) => {
                if (err) {
                    console.error('[ERRO] Erro produtos mais vistos:', err);
                    return res.status(500).json({ erro: 'Erro ao obter produtos' });
                }

                const produtos = results.map(produto => ({
                    ...produto,
                    media_avaliacoes: parseFloat(produto.media_avaliacoes).toFixed(1)
                }));

                res.json(produtos);
            });

        } catch (error) {
            console.error('[ERRO] Erro produtos mais vistos:', error.message);
            res.status(500).json({ erro: 'Erro ao obter produtos mais vistos' });
        }
    }

    async produtosRecomendados(req, res) {
        try {
            const { cliente_id } = req.params;

            // Recomendações baseadas no histórico de compras
            const sql = `
                SELECT DISTINCT p2.*
                FROM pedidos ped1
                JOIN itens_pedido ip1 ON ped1.id = ip1.pedido_id
                JOIN produtos p1 ON ip1.produto_id = p1.id
                JOIN produtos p2 ON p1.categoria = p2.categoria
                WHERE ped1.cliente_id = ? 
                AND p2.id NOT IN (
                    SELECT DISTINCT ip2.produto_id 
                    FROM pedidos ped2 
                    JOIN itens_pedido ip2 ON ped2.id = ip2.pedido_id 
                    WHERE ped2.cliente_id = ?
                )
                AND p2.estoque > 0
                ORDER BY RAND()
                LIMIT 6
            `;

            this.db.getConnection().query(sql, [cliente_id, cliente_id], (err, results) => {
                if (err) {
                    console.error('[ERRO] Erro recomendações:', err);
                    return res.status(500).json({ erro: 'Erro nas recomendações' });
                }

                res.json(results);
            });

        } catch (error) {
            console.error('[ERRO] Erro recomendações:', error.message);
            res.status(500).json({ erro: 'Erro ao obter recomendações' });
        }
    }
}

module.exports = new BuscaController();