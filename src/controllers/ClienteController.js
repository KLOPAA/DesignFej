const bcrypt = require('bcrypt');
const crypto = require('crypto');
const clienteRepository = require('../repositories/ClienteRepository');

class ClienteController {
    async cadastrar(req, res) {
        try {
            const { nome, email, senha, endereco } = req.body;

            if (!nome || !email || !senha || !endereco) {
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
            }

            if (senha.length < 6) {
                return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
            }

            // Verificar se email já existe
            const clienteExistente = await clienteRepository.buscarPorEmail(email);
            if (clienteExistente) {
                return res.status(409).json({ erro: 'Email já cadastrado.' });
            }

            // Criptografar senha
            const senhaHash = await bcrypt.hash(senha, 10);

            // Criar cliente
            const cliente = await clienteRepository.criar({
                nome,
                email,
                senha_hash: senhaHash,
                endereco
            });

            console.log('[SUCESSO] Cliente cadastrado:', cliente.id);
            
            res.status(201).json({
                mensagem: 'Usuário cadastrado com sucesso!',
                redirect: '/login.html'
            });

        } catch (error) {
            console.error('[ERRO] Erro ao cadastrar cliente:', error.message);
            res.status(500).json({ erro: 'Erro ao cadastrar cliente.' });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
            }

            // Buscar cliente por email
            const cliente = await clienteRepository.buscarPorEmail(email);
            if (!cliente) {
                return res.status(401).json({ erro: 'Email ou senha inválidos.' });
            }

            // Verificar senha
            const senhaCorreta = await bcrypt.compare(senha, cliente.senha_hash);
            if (!senhaCorreta) {
                return res.status(401).json({ erro: 'Email ou senha inválidos.' });
            }

            console.log('[LOGIN] Login realizado com sucesso:', cliente.email);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso, seja bem-vindo ao DesignFej',
                usuario: cliente.toJSON()
            });

        } catch (error) {
            console.error('[ERRO] Erro no login:', error.message);
            res.status(500).json({ erro: 'Erro no servidor.' });
        }
    }

    async listarTodos(req, res) {
        try {
            const clientes = await clienteRepository.listarTodos();
            const clientesJSON = clientes.map(cliente => cliente.toJSON());
            
            res.json(clientesJSON);
        } catch (error) {
            console.error('[ERRO] Erro ao listar clientes:', error.message);
            res.status(500).json({ erro: 'Erro ao listar clientes.' });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            
            const cliente = await clienteRepository.buscarPorId(id);
            if (!cliente) {
                return res.status(404).json({ erro: 'Cliente não encontrado.' });
            }

            res.json(cliente.toJSON());
        } catch (error) {
            console.error('[ERRO] Erro ao buscar cliente:', error.message);
            res.status(500).json({ erro: 'Erro ao buscar cliente.' });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, endereco } = req.body;

            if (!nome || !email || !endereco) {
                return res.status(400).json({ erro: 'Nome, email e endereço são obrigatórios.' });
            }

            const cliente = await clienteRepository.atualizar(id, { nome, email, endereco });
            if (!cliente) {
                return res.status(404).json({ erro: 'Cliente não encontrado.' });
            }

            res.json({
                mensagem: 'Cliente atualizado com sucesso!',
                cliente: cliente.toJSON()
            });

        } catch (error) {
            console.error('[ERRO] Erro ao atualizar cliente:', error.message);
            res.status(500).json({ erro: 'Erro ao atualizar cliente.' });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;

            const sucesso = await clienteRepository.excluir(id);
            if (!sucesso) {
                return res.status(404).json({ erro: 'Cliente não encontrado.' });
            }

            res.json({ mensagem: 'Cliente excluído com sucesso!' });

        } catch (error) {
            console.error('[ERRO] Erro ao excluir cliente:', error.message);
            res.status(500).json({ erro: 'Erro ao excluir cliente.' });
        }
    }

    async verificarEmail(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ erro: 'Email é obrigatório' });
            }

            const cliente = await clienteRepository.buscarPorEmail(email);
            
            if (cliente) {
                // Gerar token de redefinição
                const token = crypto.randomBytes(32).toString('hex');
                const expiracao = new Date(Date.now() + 3600000); // 1 hora

                await clienteRepository.atualizarTokenRedefinicao(email, token, expiracao);

                console.log('Token gerado para email:', email);
                res.json({
                    existe: true,
                    message: 'Email encontrado. Redirecionando...',
                    token: token
                });
            } else {
                console.log('Email não encontrado:', email);
                res.json({ existe: false, message: 'Email não encontrado' });
            }

        } catch (error) {
            console.error('[ERRO] Erro ao verificar email:', error.message);
            res.status(500).json({ erro: 'Erro interno do servidor ao acessar banco de dados' });
        }
    }

    async definirNovaSenha(req, res) {
        try {
            const { token, novaSenha } = req.body;

            if (!token || !novaSenha) {
                return res.status(400).json({ erro: 'Token e nova senha são obrigatórios' });
            }

            if (novaSenha.length < 6) {
                return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
            }

            // Verificar token válido e não expirado
            const cliente = await clienteRepository.buscarPorToken(token);
            
            if (!cliente) {
                return res.status(400).json({ erro: 'Token inválido ou expirado' });
            }

            const agora = new Date();
            if (agora > new Date(cliente.expira_em)) {
                return res.status(400).json({ erro: 'Token expirado' });
            }

            // Hash da nova senha
            const senhaHash = await bcrypt.hash(novaSenha, 12);

            // Atualizar senha e limpar token
            await clienteRepository.atualizarSenha(cliente.id, senhaHash);

            console.log('Senha atualizada para usuário:', cliente.id);
            res.json({ sucesso: true, mensagem: 'Senha redefinida com sucesso!' });

        } catch (error) {
            console.error('[ERRO] Erro no processo de redefinição:', error.message);
            res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    }
}

module.exports = new ClienteController();