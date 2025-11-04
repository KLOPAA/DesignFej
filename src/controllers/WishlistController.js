const wishlistRepository = require('../repositories/WishlistRepository');

class WishlistController {
    async adicionar(req, res) {
        try {
            const { cliente_id, produto_id } = req.body;

            if (!cliente_id || !produto_id) {
                return res.status(400).json({ erro: 'Cliente e produto são obrigatórios' });
            }

            const item = await wishlistRepository.adicionar(cliente_id, produto_id);

            console.log('[SUCESSO] Item adicionado à wishlist:', item.id);
            
            res.status(201).json({
                mensagem: 'Produto adicionado à lista de desejos!',
                item: item.toJSON()
            });

        } catch (error) {
            console.error('[ERRO] Erro ao adicionar à wishlist:', error.message);
            res.status(500).json({ erro: error.message });
        }
    }

    async buscarPorCliente(req, res) {
        try {
            const { cliente_id } = req.params;

            const itens = await wishlistRepository.buscarPorCliente(cliente_id);
            
            res.json(itens.map(i => i.toJSON()));

        } catch (error) {
            console.error('[ERRO] Erro ao buscar wishlist:', error.message);
            res.status(500).json({ erro: 'Erro ao buscar lista de desejos' });
        }
    }

    async remover(req, res) {
        try {
            const { cliente_id, produto_id } = req.params;

            const sucesso = await wishlistRepository.remover(cliente_id, produto_id);
            
            if (!sucesso) {
                return res.status(404).json({ erro: 'Item não encontrado na lista' });
            }

            res.json({ mensagem: 'Produto removido da lista de desejos!' });

        } catch (error) {
            console.error('[ERRO] Erro ao remover da wishlist:', error.message);
            res.status(500).json({ erro: 'Erro ao remover da lista de desejos' });
        }
    }

    async verificarExiste(req, res) {
        try {
            const { cliente_id, produto_id } = req.params;

            const existe = await wishlistRepository.verificarExiste(cliente_id, produto_id);
            
            res.json({ existe });

        } catch (error) {
            console.error('[ERRO] Erro ao verificar wishlist:', error.message);
            res.status(500).json({ erro: 'Erro ao verificar lista de desejos' });
        }
    }

    async contarItens(req, res) {
        try {
            const { cliente_id } = req.params;

            const total = await wishlistRepository.contarItens(cliente_id);
            
            res.json({ total });

        } catch (error) {
            console.error('[ERRO] Erro ao contar itens:', error.message);
            res.status(500).json({ erro: 'Erro ao contar itens da lista' });
        }
    }
}

module.exports = new WishlistController();