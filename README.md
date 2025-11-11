# DesignFej - Sistema de Joalheria

## Descrição

O DesignFej é um sistema de e-commerce para joalheria desenvolvido com arquitetura MVC (Model-View-Controller) e padrão Repository. O sistema permite gerenciamento de produtos, clientes, carrinho de compras e funcionalidades para uma loja de joias online.

## Integrantes

-   Sofia Louzada Parreiras -- 22301836
-   GABRIEL ALMEIDA DE AQUINO MAGALHAES -- 22302689
-   JULIANA CAVANELLAS AMORIM -- 22400990
-   CRISTAL FIGUEIREDO ANDRADE -- 22302204
-   Leandro Dias Santos -- 22403434
-   Lucas Vinícius Mendes Rocha -- 22400745

## Estrutura de Diretórios

    projeto-loja/
    ├── src/                    # Código-fonte principal
    │   ├── config/            # Configurações do banco
    │   ├── controllers/       # Controladores MVC
    │   ├── factories/         # Factory Method
    │   ├── models/           # Modelos de dados
    │   ├── patterns/         # Design Patterns
    │   ├── repositories/     # Camada de persistência
    │   ├── routes/           # Rotas da aplicação
    │   └── services/         # Serviços
    ├── public/               # Arquivos estáticos
    │   ├── css/             # Estilos CSS
    │   ├── html/            # Páginas HTML
    │   ├── img/             # Imagens
    │   └── js/              # Scripts JavaScript
    ├── tests/               # Testes
    ├── app.js               # Arquivo principal
    ├── db.js                # Conexão com banco
    └── package.json         # Dependências Node.js

## Como Executar o Projeto

### 1. Pré-requisitos

-   Node.js versão 16 ou superior
-   MySQL 8.0 ou superior
-   NPM

### 2. Instalação

``` bash
# Acesse a pasta do projeto
cd projeto-loja

# Instale as dependências
npm install
```

### 3. Configuração do Banco

``` bash
# Execute o script SQL no MySQL
mysql -u root -p < mysql-designfej.sql
```

### 4. Execução

``` bash
# Execute o projeto
npm start

# Ou para desenvolvimento
npm run dev
```

### 5. Acesso

-   URL local: http://localhost:3000
-   Página inicial: Login de usuário

## Funcionalidades Implementadas

**Total: 25 Funcionalidades Distintas**
<<<<<<< HEAD
Funcionalidades por Categoria:
Autenticação e Usuário (4)
Cadastro de usuários

Login de usuários

Redefinição de senha

Perfil do usuário

Catálogo e Produtos (5)
Catálogo de produtos

Páginas de categorias (Brincos, Colares, Pingentes, Alianças)

Busca de produtos

Controle de estoque

Exibição de estoque

Carrinho e Compras (6)
Carrinho de compras

Sistema de cupons

Remoção de cupons

Cálculo de frete fixo

Finalização de compra

Métodos de pagamento

Pedidos e Rastreamento (4)
Meus Pedidos

Rastreamento de pedidos

Atualização automática de status

Simulação manual de status

Funcionalidades Extras (6)
Lista de desejos (Wishlist)

Sistema de avaliações

Sidebar de navegação

Dashboard administrativo

Sistema de notificações

Backup automático
=======

### ✅ **Autenticação e Usuário (4 funcionalidades)**
1. **Cadastro de usuários** - Registro de novos clientes
2. **Login de usuários** - Autenticação no sistema
3. **Redefinição de senha** - Recuperação de acesso
4. **Perfil do usuário** - Gerenciamento de dados pessoais

### ✅ **Catálogo e Produtos (5 funcionalidades)**
5. **Catálogo de produtos** - Exibição de joias por categoria
6. **Páginas de categorias** - Brincos, Colares, Pingentes, Alianças
7. **Busca de produtos** - Sistema de pesquisa
8. **Controle de estoque** - Monitoramento automático via Observer
9. **Exibição de estoque** - Visualização em tempo real

### ✅ **Carrinho e Compras (6 funcionalidades)**
10. **Carrinho de compras** - Adicionar/remover produtos
11. **Sistema de cupons** - Descontos com padrão Decorator
12. **Remoção de cupons** - Cancelar descontos aplicados
13. **Cálculo de frete fixo** - R$ 15,90 para todo Brasil
14. **Finalização de compra** - Processo completo de checkout
15. **Métodos de pagamento** - Cartão de crédito/débito

### ✅ **Pedidos e Rastreamento (4 funcionalidades)**
16. **Meus Pedidos** - Histórico de compras
17. **Rastreamento de pedidos** - Timeline de status
18. **Atualização automática de status** - Progressão realística
19. **Simulação manual de status** - Botão para testar atualizações

### ✅ **Funcionalidades Extras (6 funcionalidades)**
20. **Lista de desejos (Wishlist)** - Produtos favoritos
21. **Sistema de avaliações** - Feedback de produtos
22. **Sidebar de navegação** - Menu lateral responsivo
23. **Dashboard administrativo** - Painel de controle
24. **Sistema de notificações** - Alertas via Observer
25. **Backup automático** - Serviço de backup de dados

>>>>>>> edb44139fc1678797acca79fc165df932d43a4c2
## Design Patterns Implementados

### 🔹 Singleton
-   **Uso**: Conexão única ao banco de dados (DatabaseConnection)
-   **Localização**: `src/config/DatabaseConnection.js`

### 🔹 Factory Method
-   **Uso**: Criação de diferentes tipos de produtos (ProdutoFactory)
-   **Localização**: `src/factories/ProdutoFactory.js`

### 🔹 Observer
-   **Uso**: Sistema de notificações
-   **Localização**: `src/patterns/Observer.js`

### 🔹 Strategy
-   **Uso**: Diferentes estratégias de cálculo
-   **Localização**: `src/patterns/Strategy.js`

### 🔹 Decorator
-   **Uso**: Sistema de cupons com múltiplos descontos
-   **Localização**: `src/patterns/Decorator.js`

### 🔹 Repository
-   **Uso**: Camada de abstração para acesso aos dados
-   **Localização**: `src/repositories/`

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Banco de Dados**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Segurança**: bcrypt para hash de senhas
- **Arquitetura**: MVC com Repository Pattern

## Arquivos de Configuração

- `package.json` - Dependências e scripts
- `app.js` - Servidor principal
- `db.js` - Configuração do banco
- `mysql-designfej.sql` - Script de criação do banco
- `start.bat` - Script de inicialização Windows
