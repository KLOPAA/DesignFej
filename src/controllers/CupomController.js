const cupomRepository = require('../repositories/CupomRepository');

class CupomController {
    async criar(req, res) {
        try {
            const { codigo, tipo, valor, data_inicio, data_fim } = req.body;

            if (!codigo || !tipo || !valor || !data_inicio || !data_fim) {
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
            }

            const cupom = await cupomRepository.criar({
                codigo,
                tipo,
                valor,
                data_inicio,
                data_fim
            });

            console.log('[SUCESSO] Cupom criado:', cupom.codigo);
            
            res.status(201).json({
                mensagem: 'Cupom criado com sucesso!',
                cupom: cupom.toJSON()
            });

        } catch (error) {
            console.error('[ERRO] Erro ao criar cupom:', error.message);
            res.status(500).json({ erro: 'Erro ao criar cupom' });
        }
    }

    async validar(req, res) {
        try {
            const { codigo } = req.body;

            if (!codigo) {
                return res.status(400).json({ erro: 'Código do cupom é obrigatório' });
            }

            const cupom = await cupomRepository.buscarPorCodigo(codigo);
            
            if (!cupom) {
                return res.status(404).json({ erro: 'Cupom não encontrado' });
            }

            if (!cupom.isValido()) {
                return res.status(400).json({ erro: 'Cupom inválido ou expirado' });
            }

            res.json({
                valido: true,
                cupom: cupom.toJSON(),
                mensagem: 'Cupom válido!'
            });

        } catch (error) {
            console.error('[ERRO] Erro ao validar cupom:', error.message);
            res.status(500).json({ erro: 'Erro ao validar cupom' });
        }
    }

    async listarAtivos(req, res) {
        try {
            const cupons = await cupomRepository.listarAtivos();
            
<<<<<<< HEAD
            res.json({
                success: true,
                cupons: cupons.map(c => c.toJSON())
            });

        } catch (error) {
            console.error('[ERRO] Erro ao listar cupons:', error.message);
            res.status(500).json({ 
                success: false,
                erro: 'Erro ao listar cupons' 
            });
        }
    }

    async listarTodos(req, res) {
        try {
            const cupons = await cupomRepository.listarTodos();
            
            res.json({
                success: true,
                cupons: cupons.map(c => c.toJSON())
            });

        } catch (error) {
            console.error('[ERRO] Erro ao listar todos os cupons:', error.message);
            res.status(500).json({ 
                success: false,
                erro: 'Erro ao listar cupons' 
            });
=======
            res.json(cupons.map(c => c.toJSON()));

        } catch (error) {
            console.error('[ERRO] Erro ao listar cupons:', error.message);
            res.status(500).json({ erro: 'Erro ao listar cupons' });
>>>>>>> edb44139fc1678797acca79fc165df932d43a4c2
        }
    }

    async usar(req, res) {
        try {
            const { codigo } = req.body;

            const cupom = await cupomRepository.buscarPorCodigo(codigo);
            
            if (!cupom || !cupom.isValido()) {
                return res.status(400).json({ erro: 'Cupom inválido' });
            }

            await cupomRepository.marcarComoUsado(cupom.id);

            res.json({
                mensagem: 'Cupom utilizado com sucesso!',
                desconto: cupom.valor
            });

        } catch (error) {
            console.error('[ERRO] Erro ao usar cupom:', error.message);
            res.status(500).json({ erro: 'Erro ao usar cupom' });
        }
    }

    async desativar(req, res) {
        try {
            const { id } = req.params;

            const sucesso = await cupomRepository.desativar(id);
            
            if (!sucesso) {
                return res.status(404).json({ erro: 'Cupom não encontrado' });
            }

            res.json({ mensagem: 'Cupom desativado com sucesso!' });

        } catch (error) {
            console.error('[ERRO] Erro ao desativar cupom:', error.message);
            res.status(500).json({ erro: 'Erro ao desativar cupom' });
        }
    }
}

module.exports = new CupomController();