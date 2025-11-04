const avaliacaoRepository = require('../repositories/AvaliacaoRepository');
const { NotificationManager } = require('../patterns/Observer');

class AvaliacaoController {
    constructor() {
        this.notificationManager = new NotificationManager();
    }

    async criar(req, res) {
        try {
            const { cliente_nome, produto_id, nota, comentario } = req.body;
            console.log('Dados recebidos:', { cliente_nome, produto_id, nota, comentario });

            if (!cliente_nome || !produto_id || !nota || !comentario) {
                console.log('Campos faltando:', { cliente_nome: !!cliente_nome, produto_id: !!produto_id, nota: !!nota, comentario: !!comentario });
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
            }

            const avaliacao = await avaliacaoRepository.criar({
                cliente_nome,
                produto_id,
                nota,
                comentario
            });

            console.log('[SUCESSO] Avaliação criada:', avaliacao.id);
            
            res.status(201).json({
                mensagem: 'Avaliação criada com sucesso!',
                avaliacao: avaliacao.toJSON()
            });

        } catch (error) {
            console.error('[ERRO] Erro ao criar avaliação:', error.message);
            res.status(500).json({ erro: 'Erro ao criar avaliação' });
        }
    }

    async buscarPorProduto(req, res) {
        try {
            const { produto_id } = req.params;

            const avaliacoes = await avaliacaoRepository.buscarPorProduto(produto_id);
            const media = await avaliacaoRepository.calcularMediaProduto(produto_id);

            res.json({
                avaliacoes: avaliacoes.map(a => a.toJSON()),
                estatisticas: media
            });

        } catch (error) {
            console.error('[ERRO] Erro ao buscar avaliações:', error.message);
            res.status(500).json({ erro: 'Erro ao buscar avaliações' });
        }
    }

    async listarTodas(req, res) {
        try {
            const avaliacoes = await avaliacaoRepository.listarTodas();
            
            res.json(avaliacoes.map(a => a.toJSON()));

        } catch (error) {
            console.error('[ERRO] Erro ao listar avaliações:', error.message);
            res.status(500).json({ erro: 'Erro ao listar avaliações' });
        }
    }

    async obterEstatisticas(req, res) {
        try {
            const { produto_id } = req.params;
            const media = await avaliacaoRepository.calcularMediaProduto(produto_id);
            
            res.json(media);

        } catch (error) {
            console.error('[ERRO] Erro ao obter estatísticas:', error.message);
            res.status(500).json({ erro: 'Erro ao obter estatísticas' });
        }
    }
}

module.exports = new AvaliacaoController();