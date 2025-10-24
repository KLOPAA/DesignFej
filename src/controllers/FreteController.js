const FreteService = require('../services/FreteService');

class FreteController {
    async calcular(req, res) {
        try {
            const { cep, peso } = req.body;

            if (!cep) {
                return res.status(400).json({ error: 'CEP é obrigatório' });
            }

            if (!FreteService.validarCEP(cep)) {
                return res.status(400).json({ error: 'CEP inválido' });
            }

            const frete = FreteService.calcularFrete(cep, peso || 1);
            
            res.json(frete);

        } catch (error) {
            console.error('Erro ao calcular frete:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new FreteController();