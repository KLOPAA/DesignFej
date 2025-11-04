-- Backup DesignFej - 27/10/2025, 09:01:48

-- Estrutura da tabela cadastro
DROP TABLE IF EXISTS cadastro;
CREATE TABLE `cadastro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `token_redefinicao` varchar(255) DEFAULT NULL,
  `expira_em` datetime DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiracao` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela cadastro
INSERT INTO cadastro (id, nome, email, senha_hash, endereco, token_redefinicao, expira_em, criado_em, reset_token, reset_token_expiracao) VALUES
(1, 'conta teste', 'contateste@gmail.com', '$2b$12$BsNnYl9Q1P2jlGZ2mu7wWezTZwAhSQBPPzpZZEaqDgWhfzr4zmGxK', 'rua teste', NULL, NULL, '2025-09-05 09:31:42', NULL, NULL),
(2, 'Sofia Louzada Parreiras', 'sofilouzzparr@gmail.com', '$2b$10$jIQS6ZFruCoQAnFEwuwJsu44i60hvJgwL5upnazi8dwrCkg/3JLyW', 'rua dela ', NULL, NULL, '2025-09-05 10:21:20', NULL, NULL),
(3, 'gleison', 'gleison@cotemig.com.br', '$2b$10$bG91BYHyW7/Al3MKu5RiU.iKvCuDMcw6FAeQeT1pkBoZqd5g4/pvK', '123456', NULL, NULL, '2025-09-05 11:26:38', NULL, NULL),
(4, 'Gabriel', 'gabriel@gmail.com', '$2b$10$PQO9nejGDs7hiYXp8hsTPu05nXuzwyJcDcTis8IgB7jF9bsldJFmK', 'rua vinte e quatro', NULL, NULL, '2025-10-23 12:21:15', NULL, NULL),
(5, 'Sofia Louzada Parreiras', 'sofialinda@gmail.com', '$2b$12$FZ5pXV.iJCmjQ5nzmuRvLuB.U/Hnoa0HxEQOlWB/9uJlOweY.3wk.', 'rua do momo', NULL, NULL, '2025-10-24 10:28:58', 'b652d40e404502456adfc3b1946f750bf10a37b9f031777c11e7dabe00aa57b2', '2025-10-24 14:38:44');


-- Estrutura da tabela produtos
DROP TABLE IF EXISTS produtos;
CREATE TABLE `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `preco` decimal(10,2) NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `estoque` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela produtos
INSERT INTO produtos (id, nome, descricao, preco, imagem, categoria, estoque, created_at) VALUES
(1, 'Brinco de Ouro 18k', 'Brinco delicado em ouro amarelo 18k com detalhe em zirconia', '289.90', '/img/brinco-ouro.jpg', 'Brincos', 9, '2025-10-24 14:02:56'),
(2, 'Colar de Prata Sterling', 'Colar elegante em prata sterling com pingente de coração', '189.90', '/img/colar-prata.jpg', 'Colares', 8, '2025-10-24 14:02:56'),
(3, 'Anel com Diamante', 'Anel solitário em ouro branco 18k com diamante central', '459.90', '/img/anel-diamante.jpg', 'Anéis', 3, '2025-10-24 14:02:56'),
(4, 'Pulseira de Ouro', 'Pulseira elegante em ouro 18k', '350.00', '/img/pulseira-ouro.jpg', 'Pulseiras', 12, '2025-10-24 14:02:56'),
(5, 'Conjunto Esmeralda', 'Conjunto com brincos e colar de esmeralda', '890.00', '/img/conjunto-esmeralda.jpg', 'Conjuntos', 5, '2025-10-24 14:02:56'),
(6, 'Aliança de Casamento', 'Aliança clássica em ouro 18k', '420.00', '/img/alianca-casamento.jpg', 'Alianças', 19, '2025-10-24 14:02:56'),
(7, 'Corrente de Ouro 18k', 'Corrente masculina em ouro 18k', '680.00', '/img/corrente-ouro.jpg', 'Correntes', 5, '2025-10-24 14:02:56'),
(8, 'Brinco com Rubi', 'Brinco sofisticado com rubi natural', '520.00', '/img/brinco-rubi.jpg', 'Brincos', 2, '2025-10-24 14:02:56'),
(9, 'Pingente Aqua', 'Pingente delicado com pedra aqua marinha', '180.00', '/img/pingente-aqua.jpg', 'Pingentes', 8, '2025-10-24 14:02:56');


-- Estrutura da tabela pedidos
DROP TABLE IF EXISTS pedidos;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_pedido` varchar(20) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `frete` decimal(10,2) NOT NULL DEFAULT '15.90',
  `tipo_pagamento` varchar(50) NOT NULL,
  `nome_usuario` varchar(100) NOT NULL,
  `data_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_pedido` (`numero_pedido`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela pedidos
INSERT INTO pedidos (id, numero_pedido, valor_total, frete, tipo_pagamento, nome_usuario, data_pedido) VALUES
(1, '#2339 2260', '405.80', '15.90', 'Cartão de Crédito', 'sofia louzada preis bach', '2025-10-24 16:29:52'),
(2, '#2614 3394', '305.80', '15.90', 'Cartão de Crédito', 'teste 4', '2025-10-24 17:15:43'),
(3, '#2653 8158', '465.70', '15.90', 'Cartão de Crédito', 'teste 5', '2025-10-24 17:22:18');


-- Estrutura da tabela avaliacoes
DROP TABLE IF EXISTS avaliacoes;
CREATE TABLE `avaliacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `produto_id` int NOT NULL,
  `nota` int NOT NULL,
  `comentario` text,
  `data_avaliacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cliente_nome` varchar(100) NOT NULL DEFAULT 'Usuário',
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `produto_id` (`produto_id`),
  CONSTRAINT `avaliacoes_chk_1` CHECK (((`nota` >= 1) and (`nota` <= 5)))
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela avaliacoes
INSERT INTO avaliacoes (id, cliente_id, produto_id, nota, comentario, data_avaliacao, cliente_nome) VALUES
(9, 0, 9, 5, 'produto muito muito bom!!!', '2025-10-24 16:03:07', 'Sofia Louzada Parreiras'),
(8, 0, 8, 5, 'produto muito muito bom!!!', '2025-10-24 16:02:32', 'sosooooooooooooo');


-- Estrutura da tabela cupons
DROP TABLE IF EXISTS cupons;
CREATE TABLE `cupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `tipo` enum('percentual','fixo') NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `usado` tinyint(1) DEFAULT '0',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela cupons
INSERT INTO cupons (id, codigo, tipo, valor, data_inicio, data_fim, ativo, usado, criado_em) VALUES
(1, 'DESCONTO10', 'fixo', '10.00', '2025-01-01 03:00:00', '2025-12-31 03:00:00', 1, 0, '2025-10-24 14:11:04'),
(2, 'FRETE20', 'fixo', '20.00', '2025-01-01 03:00:00', '2025-12-31 03:00:00', 1, 0, '2025-10-24 14:11:04'),
(3, 'PRIMEIRA15', 'percentual', '15.00', '2025-01-01 03:00:00', '2025-11-15 03:00:00', 1, 0, '2025-10-24 14:11:04'),
(4, 'GLEISON60', 'percentual', '60.00', '2025-01-01 03:00:00', '2025-11-30 03:00:00', 1, 0, '2025-10-24 14:11:04'),
(5, 'EXPIRADO50', 'percentual', '50.00', '2024-01-01 03:00:00', '2024-12-31 03:00:00', 0, 0, '2025-10-24 14:11:04');


