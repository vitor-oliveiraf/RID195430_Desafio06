# 🏪 DNC Store Manager

Sistema completo de gerenciamento de loja desenvolvido com Node.js, TypeScript, Express, Prisma e MongoDB. O projeto utiliza uma arquitetura híbrida com PostgreSQL (via Prisma) e MongoDB para diferentes funcionalidades.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Express** - Framework web para APIs
- **Prisma** - ORM para PostgreSQL
- **MongoDB** - Banco de dados NoSQL
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Cross-origin resource sharing
- **Mongoose** - ODM para MongoDB

## 📁 Estrutura do Projeto

```
dnc_store_manager/
├── src/
│   ├── config/
│   │   └── database.ts        # Configuração de conexões com bancos
│   ├── modules/
│   │   ├── usuario/           # Módulo de usuários
│   │   ├── produtos/          # Módulo de produtos
│   │   ├── estoque/           # Módulo de estoque
│   │   ├── pedido/            # Módulo de pedidos
│   │   └── venda/             # Módulo de vendas
│   ├── shared/
│   │   ├── errors/            # Tratamento de erros
│   │   ├── middlewares/       # Middlewares compartilhados
│   │   ├── types/             # Tipos compartilhados
│   │   └── utils/             # Utilitários
│   ├── routes/                # Rotas principais
│   └── app.ts                 # Configuração da aplicação
├── prisma/
│   ├── migrations/            # Migrações do PostgreSQL
│   └── schema.prisma          # Schema do Prisma
├── scripts/                   # Scripts utilitários
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (versão 12 ou superior)
- **MongoDB** (versão 5 ou superior)

### Instalando os Bancos de Dados

#### PostgreSQL

```bash
# Windows (usando Chocolatey)
choco install postgresql

# macOS (usando Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### MongoDB

```bash
# Windows (usando Chocolatey)
choco install mongodb

# macOS (usando Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian
sudo apt update
sudo apt install mongodb
```

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd dnc_store_manager
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Copie o exemplo (se existir) ou crie manualmente
cp .env.example .env
```

Configure as seguintes variáveis no arquivo `.env`:

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# PostgreSQL (Prisma)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/dnc_store_manager"

# MongoDB
MONGODB_URI="mongodb://localhost:27017/dnc_store_manager"

# Configurações de Segurança (opcional)
JWT_SECRET="sua-chave-secreta-aqui"
```

### 4. Configure os Bancos de Dados

#### PostgreSQL

```bash
# Crie o banco de dados
createdb dnc_store_manager

# Ou usando psql
psql -U postgres
CREATE DATABASE dnc_store_manager;
\q
```

#### MongoDB

```bash
# Inicie o serviço MongoDB
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 5. Execute as Migrações

```bash
# Gere o cliente Prisma
npm run db:generate

# Execute as migrações do PostgreSQL
npm run db:migrate
```

### 6. Inicie o Servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📋 Scripts Disponíveis

| Comando                 | Descrição                                           |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | Inicia o servidor de desenvolvimento com hot reload |
| `npm run build`         | Compila o projeto TypeScript                        |
| `npm run start`         | Inicia o servidor em produção                       |
| `npm run db:generate`   | Gera o cliente Prisma                               |
| `npm run db:migrate`    | Executa as migrações do PostgreSQL                  |
| `npm run db:studio`     | Abre o Prisma Studio para visualizar dados          |
| `npm run check:mongodb` | Verifica a conexão com MongoDB                      |
| `npm run test:estoque`  | Executa testes do módulo de estoque                 |
| `npm run test:calculo`  | Executa testes de cálculos                          |

## 🔗 Endpoints da API

### Base URL: `http://localhost:3000/api`

### Health Check

- `GET /health` - Verificar status da aplicação

### Usuários

- `POST /usuarios` - Criar usuário
- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/:id` - Buscar usuário por ID
- `GET /usuarios/email/:email` - Buscar usuário por email
- `PUT /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Deletar usuário

### Produtos

- `POST /produtos` - Criar produto
- `GET /produtos` - Listar todos os produtos
- `GET /produtos/:id` - Buscar produto por ID
- `PUT /produtos/:id` - Atualizar produto
- `DELETE /produtos/:id` - Deletar produto

### Estoque

- `POST /estoque` - Adicionar produto ao estoque
- `GET /estoque` - Listar todo o estoque
- `GET /estoque/:id` - Buscar estoque por ID
- `PUT /estoque/:id` - Atualizar quantidade em estoque
- `DELETE /estoque/:id` - Remover produto do estoque

### Pedidos

- `POST /pedidos` - Criar pedido
- `GET /pedidos` - Listar todos os pedidos
- `GET /pedidos/:id` - Buscar pedido por ID
- `PUT /pedidos/:id` - Atualizar pedido
- `DELETE /pedidos/:id` - Cancelar pedido

### Vendas

- `POST /vendas` - Registrar venda
- `GET /vendas` - Listar todas as vendas
- `GET /vendas/:id` - Buscar venda por ID
- `GET /vendas/relatorio` - Gerar relatório de vendas

## 🧪 Testando a API

### Usando Postman

1. Importe a coleção `DNC_Store_Manager_API.postman_collection.json`
2. Configure as variáveis de ambiente no Postman
3. Execute os requests

### Usando cURL

```bash
# Health check
curl http://localhost:3000/health

# Criar usuário
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva", "email": "joao@email.com", "senha": "123456"}'

# Listar usuários
curl http://localhost:3000/api/usuarios
```

## 🗄️ Estrutura dos Bancos de Dados

### PostgreSQL (via Prisma)

- **usuarios** - Tabela de usuários
- **produtos** - Tabela de produtos
- **estoques** - Tabela de estoque

### MongoDB

- **pedidos** - Coleção de pedidos
- **vendas** - Coleção de vendas
- **relatorios** - Coleção de relatórios

## 🔧 Ferramentas de Desenvolvimento

### Prisma Studio

```bash
npm run db:studio
```

Acesse `http://localhost:5555` para visualizar e editar dados do PostgreSQL.

### MongoDB Compass

Instale o MongoDB Compass para visualizar dados do MongoDB:

- [Download MongoDB Compass](https://www.mongodb.com/try/download/compass)

## 🏗️ Arquitetura

O projeto segue os princípios da **Arquitetura Limpa** (Clean Architecture):

- **Entities** - Regras de negócio centrais
- **Use Cases** - Casos de uso da aplicação
- **Controllers** - Interface com o usuário
- **Repositories** - Acesso a dados
- **DTOs** - Transferência de dados
- **Schemas** - Validação de entrada

### Padrão de Módulos

Cada módulo segue a estrutura:

```
modules/nome-do-modulo/
├── controllers/   # Controladores HTTP
├── dtos/         # Data Transfer Objects
├── entities/     # Entidades do domínio
├── repositories/ # Camada de acesso a dados
├── routes/       # Definição das rotas
├── schema/       # Schemas de validação
└── services/     # Lógica de negócio
```

## 🔒 Segurança

- Validação de dados com Zod
- Sanitização de entrada
- Headers de segurança com Helmet
- CORS configurado
- Tratamento de erros centralizado
- Conexões seguras com bancos de dados

## 🐛 Solução de Problemas

### Erro de Conexão com PostgreSQL

```bash
# Verifique se o PostgreSQL está rodando
# Windows
net start postgresql-x64-15

# macOS
brew services list | grep postgresql

# Ubuntu/Debian
sudo systemctl status postgresql
```

### Erro de Conexão com MongoDB

```bash
# Verifique se o MongoDB está rodando
# Windows
net start MongoDB

# macOS
brew services list | grep mongodb

# Ubuntu/Debian
sudo systemctl status mongod
```

### Erro de Porta em Uso

```bash
# Verifique qual processo está usando a porta 3000
lsof -i :3000

# Mate o processo
kill -9 <PID>
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 📞 Suporte

Para dúvidas ou problemas:

- Abra uma issue no repositório
- Consulte a documentação dos módulos específicos
- Verifique os logs do servidor para debugging

---

**Desenvolvido com ❤️ para o desafio DNC**
