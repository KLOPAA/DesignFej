class FreteService {
    static calcularFrete(cep, peso = 1) {
        // Remove caracteres não numéricos do CEP
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length !== 8) {
            throw new Error('CEP inválido');
        }

        // Frete fixo para todo o Brasil
        const freteFixo = {
            regiao: 'Todo o Brasil',
            valor: 15.90,
            prazo: '5-7 dias úteis'
        };

        return {
            cep: cepLimpo,
            regiao: freteFixo.regiao,
            valor: freteFixo.valor,
            prazo: freteFixo.prazo,
            peso: peso
        };
    }

    static validarCEP(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        return cepLimpo.length === 8;
    }
}

module.exports = FreteService;