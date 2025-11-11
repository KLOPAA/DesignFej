const DatabaseConnection = require('../config/DatabaseConnection');

class RelatorioController {
    constructor() {
        this.db = DatabaseConnection.getInstance();
    }

    async vendas(req, res) {
        try {
            const { data_inicio, data_fim } = req.query;

            let sql = `
                SELECT 
                    DATE(p.created_at) as data,
                    COUNT(*) as total_pedidos,
                    SUM(p.total) as total_vendas,
                    AVG(p.total) as ticket_medio
                FROM pedidos p 
                WHERE p.status = 'confirmado'
            `;

            const params = [];
            
            if (data_inicio && data_fim) {
                sql += ' AND DATE(p.created_at) BETWEEN ? AND ?';
                params.push(data_inicio, data_fim);
            }

            sql += ' GROUP BY DATE(p.created_at) ORDER BY data DESC';

            this.db.getConnection().query(sql, params, (err, results) => {
                if (err) {
                    console.error('[ERRO] Erro no relatório de vendas:', err);
                    return res.status(500).json({ erro: 'Erro ao gerar relatório' });
                }

                const relatorio = results.map(row => ({
                    data: row.data,
                    total_pedidos: row.total_pedidos,
                    total_vendas: parseFloat(row.total_vendas).toFixed(2),
                    ticket_medio: parseFloat(row.ticket_medio).toFixed(2)
                }));

                res.json(relatorio);
            });

        } catch (error) {
            console.error('[ERRO] Erro no relatório de vendas:', error.message);
            res.status(500).json({ erro: 'Erro ao gerar relatório de vendas' });
        }
    }

    async produtosMaisVendidos(req, res) {
        try {
            const sql = `
                SELECT 
                    pr.nome,
                    pr.categoria,
                    SUM(ip.quantidade) as total_vendido,
                    SUM(ip.preco * ip.quantidade) as receita_total
                FROM itens_pedido ip
                JOIN produtos pr ON ip.produto_id = pr.id
                JOIN pedidos p ON ip.pedido_id = p.id
                WHERE p.status = 'confirmado'
                GROUP BY pr.id, pr.nome, pr.categoria
                ORDER BY total_vendido DESC
                LIMIT 10
            `;

            this.db.getConnection().query(sql, (err, results) => {
                if (err) {
                    console.error('[ERRO] Erro no relatório de produtos:', err);
                    return res.status(500).json({ erro: 'Erro ao gerar relatório' });
                }

                const relatorio = results.map(row => ({
                    nome: row.nome,
                    categoria: row.categoria,
                    total_vendido: row.total_vendido,
                    receita_total: parseFloat(row.receita_total).toFixed(2)
                }));

                res.json(relatorio);
            });

        } catch (error) {
            console.error('[ERRO] Erro no relatório de produtos:', error.message);
            res.status(500).json({ erro: 'Erro ao gerar relatório de produtos' });
        }
    }

    async dashboard(req, res) {
        try {
            const queries = {
                totalClientes: 'SELECT COUNT(*) as total FROM cadastro',
                totalProdutos: 'SELECT COUNT(*) as total FROM produtos',
                totalPedidos: 'SELECT COUNT(*) as total FROM pedidos WHERE status = "confirmado"',
                vendasHoje: 'SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE DATE(created_at) = CURDATE() AND status = "confirmado"',
                pedidosPendentes: 'SELECT COUNT(*) as total FROM pedidos WHERE status = "pendente"',
                produtosEstoqueBaixo: 'SELECT COUNT(*) as total FROM produtos WHERE estoque < 5'
            };

            const resultados = {};
            const promises = Object.keys(queries).map(key => {
                return new Promise((resolve, reject) => {
                    this.db.getConnection().query(queries[key], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resultados[key] = results[0].total;
                            resolve();
                        }
                    });
                });
            });

            await Promise.all(promises);

            res.json({
                estatisticas: resultados,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('[ERRO] Erro no dashboard:', error.message);
            res.status(500).json({ erro: 'Erro ao carregar dashboard' });
        }
    }

    async clientesAtivos(req, res) {
        try {
            const sql = `
                SELECT 
                    c.nome,
                    c.email,
                    COUNT(p.id) as total_pedidos,
                    SUM(p.total) as total_gasto,
                    MAX(p.created_at) as ultimo_pedido
                FROM cadastro c
                LEFT JOIN pedidos p ON c.id = p.cliente_id AND p.status = 'confirmado'
                GROUP BY c.id, c.nome, c.email
                HAVING total_pedidos > 0
                ORDER BY total_gasto DESC
                LIMIT 20
            `;

            this.db.getConnection().query(sql, (err, results) => {
                if (err) {
                    console.error('[ERRO] Erro no relatório de clientes:', err);
                    return res.status(500).json({ erro: 'Erro ao gerar relatório' });
                }

                const relatorio = results.map(row => ({
                    nome: row.nome,
                    email: row.email,
                    total_pedidos: row.total_pedidos,
                    total_gasto: parseFloat(row.total_gasto || 0).toFixed(2),
                    ultimo_pedido: row.ultimo_pedido
                }));

                res.json(relatorio);
            });

        } catch (error) {
            console.error('[ERRO] Erro no relatório de clientes:', error.message);
            res.status(500).json({ erro: 'Erro ao gerar relatório de clientes' });
        }
    }

    async estoque(req, res) {
        try {
            const sql = `
                SELECT 
                    nome,
                    categoria,
                    estoque,
                    preco,
                    CASE 
                        WHEN estoque = 0 THEN 'Sem estoque'
                        WHEN estoque < 5 THEN 'Estoque baixo'
                        WHEN estoque < 20 THEN 'Estoque médio'
                        ELSE 'Estoque alto'
                    END as status_estoque
                FROM produtos
                ORDER BY estoque ASC, categoria
            `;

            this.db.getConnection().query(sql, (err, results) => {
                if (err) {
                    console.error('[ERRO] Erro no relatório de estoque:', err);
                    return res.status(500).json({ erro: 'Erro ao gerar relatório' });
                }

                const relatorio = results.map(row => ({
                    nome: row.nome,
                    categoria: row.categoria,
                    estoque: row.estoque,
                    preco: parseFloat(row.preco).toFixed(2),
                    status_estoque: row.status_estoque
                }));

                res.json(relatorio);
            });

        } catch (error) {
            console.error('[ERRO] Erro no relatório de estoque:', error.message);
            res.status(500).json({ erro: 'Erro ao gerar relatório de estoque' });
        }
    }
}

module.exports = new RelatorioController();