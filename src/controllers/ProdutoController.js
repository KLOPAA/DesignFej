const produtoRepository = require('../repositories/ProdutoRepository');

class ProdutoController {
    async criar(req, res) {
        try {
            const { nome, descricao, preco, imagem, categoria, estoque } = req.body;

            if (!nome || !descricao || !preco || !categoria) {
                return res.status(400).json({ erro: 'Nome, descrição, preço e categoria são obrigatórios.' });
            }

            const produto = await produtoRepository.criar({
                nome,
                descricao,
                preco,
                imagem,
                categoria,
                estoque: estoque || 0
            });

            console.log('[SUCESSO] Produto criado:', produto.id);
            
            res.status(201).json({
                mensagem: 'Produto criado com sucesso!',
                produto: produto.toJSON()
            });

        } catch (error) {
            console.error('[ERRO] Erro ao criar produto:', error.message);
            res.status(500).json({ erro: 'Erro ao criar produto.' });
        }
    }

    async listarTodos(req, res) {
        try {
            const produtos = await produtoRepository.listarTodos();
            const produtosJSON = produtos.map(produto => produto.toJSON());
            
            res.json(produtosJSON);
        } catch (error) {
            console.error('[ERRO] Erro ao listar produtos:', error.message);
            res.status(500).json({ erro: 'Erro ao listar produtos.' });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            
            const produto = await produtoRepository.buscarPorId(id);
            if (!produto) {
                return res.status(404).json({ erro: 'Produto não encontrado.' });
            }

            res.json(produto.toJSON());
        } catch (error) {
            console.error('[ERRO] Erro ao buscar produto:', error.message);
            res.status(500).json({ erro: 'Erro ao buscar produto.' });
        }
    }

    async buscarPorCategoria(req, res) {
        try {
            const { categoria } = req.query;
            
            if (!categoria) {
                return res.status(400).json({ erro: 'Categoria é obrigatória.' });
            }

            const produtos = await produtoRepository.buscarPorCategoria(categoria);
            const produtosJSON = produtos.map(produto => produto.toJSON());
            
            res.json(produtosJSON);
        } catch (error) {
            console.error('[ERRO] Erro ao buscar produtos por categoria:', error.message);
            res.status(500).json({ erro: 'Erro ao buscar produtos por categoria.' });
        }
    }

    async buscarPorNome(req, res) {
        try {
            const { nome } = req.query;
            
            if (!nome) {
                return res.status(400).json({ erro: 'Nome é obrigatório.' });
            }

            const produtos = await produtoRepository.buscarPorNome(nome);
            const produtosJSON = produtos.map(produto => produto.toJSON());
            
            res.json(produtosJSON);
        } catch (error) {
            console.error('[ERRO] Erro ao buscar produtos por nome:', error.message);
            res.status(500).json({ erro: 'Erro ao buscar produtos por nome.' });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, preco, imagem, categoria, estoque } = req.body;

            if (!nome || !descricao || !preco || !categoria) {
                return res.status(400).json({ erro: 'Nome, descrição, preço e categoria são obrigatórios.' });
            }

            const produto = await produtoRepository.atualizar(id, {
                nome,
                descricao,
                preco,
                imagem,
                categoria,
                estoque
            });

            if (!produto) {
                return res.status(404).json({ erro: 'Produto não encontrado.' });
            }

            res.json({
                mensagem: 'Produto atualizado com sucesso!',
                produto: produto.toJSON()
            });

        } catch (error) {
            console.error('[ERRO] Erro ao atualizar produto:', error.message);
            res.status(500).json({ erro: 'Erro ao atualizar produto.' });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;

            const sucesso = await produtoRepository.excluir(id);
            if (!sucesso) {
                return res.status(404).json({ erro: 'Produto não encontrado.' });
            }

            res.json({ mensagem: 'Produto excluído com sucesso!' });

        } catch (error) {
            console.error('[ERRO] Erro ao excluir produto:', error.message);
            res.status(500).json({ erro: 'Erro ao excluir produto.' });
        }
    }

    async atualizarEstoque(req, res) {
        try {
            const { id } = req.params;
            const { estoque } = req.body;

            if (estoque === undefined || estoque < 0) {
                return res.status(400).json({ erro: 'Estoque deve ser um número não negativo.' });
            }

            const sucesso = await produtoRepository.atualizarEstoque(id, estoque);
            if (!sucesso) {
                return res.status(404).json({ erro: 'Produto não encontrado.' });
            }

            res.json({ mensagem: 'Estoque atualizado com sucesso!' });

        } catch (error) {
            console.error('[ERRO] Erro ao atualizar estoque:', error.message);
            res.status(500).json({ erro: 'Erro ao atualizar estoque.' });
        }
    }
}

module.exports = new ProdutoController();