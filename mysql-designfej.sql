-- Script SQL limpo - apenas tabelas funcionais
CREATE DATABASE bd_usuario;
USE bd_usuario;

-- Tabela de cadastro (clientes) - UTILIZADA
CREATE TABLE IF NOT EXISTS cadastro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    token_redefinicao VARCHAR(255),
    expira_em DATETIME,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos - UTILIZADA
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255),
    categoria VARCHAR(100),
    estoque INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de avaliações - UTILIZADA
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nome VARCHAR(100) NOT NULL,
    produto_id INT NOT NULL,
    nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- avaliação feita no front vai para o banco de dados na tabela avaliacoes 

-- Tabela de cupons - UTILIZADA
CREATE TABLE IF NOT EXISTS cupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    tipo ENUM('percentual', 'fixo') NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    usado BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos - UTILIZADA
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_pedido VARCHAR(20) NOT NULL UNIQUE,
    valor_total DECIMAL(10, 2) NOT NULL,
    frete DECIMAL(10, 2) NOT NULL DEFAULT 15.90,
    tipo_pagamento VARCHAR(50) NOT NULL,
    nome_usuario VARCHAR(100) NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir produtos de exemplo
INSERT INTO produtos (nome, descricao, preco, imagem, categoria, estoque) VALUES
('Brinco de Ouro 18k', 'Brinco delicado em ouro amarelo 18k com detalhe em zirconia', 289.90, '/img/brinco-ouro.jpg', 'Brincos', 15),
('Colar de Prata Sterling', 'Colar elegante em prata sterling com pingente de coração', 189.90, '/img/colar-prata.jpg', 'Colares', 8),
('Anel com Diamante', 'Anel solitário em ouro branco 18k com diamante central', 459.90, '/img/anel-diamante.jpg', 'Anéis', 3),
('Pulseira de Ouro', 'Pulseira elegante em ouro 18k', 350.00, '/img/pulseira-ouro.jpg', 'Pulseiras', 12),
('Conjunto Esmeralda', 'Conjunto com brincos e colar de esmeralda', 890.00, '/img/conjunto-esmeralda.jpg', 'Conjuntos', 5),
('Aliança de Casamento', 'Aliança clássica em ouro 18k', 420.00, '/img/alianca-casamento.jpg', 'Alianças', 20),
('Corrente de Ouro 18k', 'Corrente masculina em ouro 18k', 680.00, '/img/corrente-ouro.jpg', 'Correntes', 7),
('Brinco com Rubi', 'Brinco sofisticado com rubi natural', 520.00, '/img/brinco-rubi.jpg', 'Brincos', 4),
('Pingente Aqua', 'Pingente delicado com pedra aqua marinha', 180.00, '/img/pingente-aqua.jpg', 'Pingentes', 10);

-- Inserir cupons de exemplo
INSERT INTO cupons (codigo, tipo, valor, data_inicio, data_fim, ativo) VALUES
('DESCONTO10', 'fixo', 10.00, '2025-01-01', '2025-12-31', TRUE),
('FRETE20', 'fixo', 20.00, '2025-01-01', '2025-12-31', TRUE),
('PRIMEIRA15', 'percentual', 15.00, '2025-01-01', '2025-11-15', TRUE),
('GLEISON60', 'percentual', 60.00, '2025-01-01', '2025-11-30', TRUE),
('EXPIRADO50', 'percentual', 50.00, '2024-01-01', '2024-12-31', FALSE);
