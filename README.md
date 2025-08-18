# DNC Store Manager

Sistema de gerenciamento de loja desenvolvido com Node.js, TypeScript, Express e Prisma.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Zod** - Validação de dados
- **Helmet** - Segurança
- **CORS** - Cross-origin resource sharing

## 📁 Estrutura do Projeto

```
dnc_store_manager/
├── src/
│   ├── modules/
│   │   └── usuario/           # Módulo de usuários
│   │       ├── controllers/   # Controladores HTTP
│   │       ├── dtos/         # Data Transfer Objects
│   │       ├── entities/     # Entidades do domínio
│   │       ├── repositories/ # Camada de acesso a dados
│   │       ├── routes/       # Definição das rotas
│   │       ├── schema/       # Schemas de validação
│   │       └── services/     # Lógica de negócio
│   ├── shared/
│   │   ├── errors/          # Tratamento de erros
│   │   ├── middlewares/     # Middlewares compartilhados
│   │   ├── types/           # Tipos compartilhados
│   │   └── utils/           # Utilitários
│   ├── routes/              # Rotas principais
│   └── app.ts               # Configuração da aplicação
├── prisma/
│   ├── migrations/          # Migrações do banco
│   └── schema.prisma        # Schema do Prisma
└── package.json
```

## 🛠️ Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd dnc_store_manager
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados**

```bash
# Gere o cliente Prisma
npm run db:generate

# Execute as migrações
npm run db:migrate
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto TypeScript
- `npm run start` - Inicia o servidor em produção
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:migrate` - Executa as migrações
- `npm run db:studio` - Abre o Prisma Studio

## 🔗 Endpoints da API

### Base URL: `http://localhost:3000/api`

### Usuários

- `POST /usuarios` - Criar usuário
- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/:id` - Buscar usuário por ID
- `GET /usuarios/email/:email` - Buscar usuário por email
- `PUT /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Deletar usuário

### Health Check

- `GET /health` - Verificar status da aplicação

## 🧪 Testando a API

Use o arquivo `test-usuario.http` para testar os endpoints do módulo de usuário. Este arquivo pode ser usado com extensões como:

- **VS Code**: REST Client
- **IntelliJ IDEA**: HTTP Client
- **Postman**: Importar como coleção

## 📚 Documentação dos Módulos

Cada módulo possui sua própria documentação:

- [Módulo de Usuário](./src/modules/usuario/README.md)

## 🔒 Segurança

- Validação de dados com Zod
- Sanitização de entrada
- Headers de segurança com Helmet
- CORS configurado
- Tratamento de erros centralizado

## 🏗️ Arquitetura

O projeto segue os princípios da **Arquitetura Limpa** (Clean Architecture):

- **Entities**: Regras de negócio centrais
- **Use Cases**: Casos de uso da aplicação
- **Controllers**: Interface com o usuário
- **Repositories**: Acesso a dados
- **DTOs**: Transferência de dados
- **Schemas**: Validação de entrada

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
# RID195430_Desafio06
