# 📄 API RESTful - Avaliação Backend

API RESTful com operações CRUD e autenticação JWT, construída com TypeScript, Express, Prisma e arquitetura modular.

## 🚀 Tecnologias Utilizadas

- **TypeScript** - Linguagem principal
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Zod** - Validação de dados
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT
- **dotenv** - Variáveis de ambiente
- **Swagger** - Documentação da API

## 📁 Estrutura do Projeto

```
src/
├── config/         # Configurações da aplicação
├── models/         # Tipagens e validações com Zod
├── dao/            # Acesso a dados com Prisma
├── services/       # Regras de negócio
├── controllers/    # Manipulação de requisições e respostas
├── routes/         # Definição das rotas HTTP
├── middleware/     # Middlewares (autenticação, tratamento de erros)
├── utils/          # Funções auxiliares (geração de token)
```

## ⚙️ Configuração

### 1. Instalação das Dependências

```bash
npm install
```

### 2. Configuração do Banco de Dados

O projeto usa SQLite com Prisma. O banco será criado automaticamente.

```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar as migrations
npx prisma migrate dev
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRATION=24h
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
```

### 4. Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Documentação da API

### 🔍 Swagger UI

A documentação interativa da API está disponível em:
```
http://localhost:3000/api-docs
```

### 🔐 Autenticação

#### POST `/auth/login`
Realiza login e gera token JWT.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "jwt_token_aqui"
}
```

### 👥 Usuários

#### POST `/users`
Criação de usuário (rota pública).

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "id": "1",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

#### GET `/users`
Lista todos os usuários com paginação (rota protegida).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- `page`: número da página (opcional, default = 1)
- `limit`: número de itens por página (opcional, default = 10)

**Exemplo:**
```
GET /users?page=2&limit=5
```

**Resposta:**
```json
{
  "items": [
    {
      "id": "1",
      "name": "Ana",
      "email": "ana@email.com"
    }
  ],
  "meta": {
    "totalItems": 25,
    "totalPages": 5,
    "currentPage": 2,
    "perPage": 5
  }
}
```

#### GET `/users/:id`
Busca um usuário por ID (rota protegida).

#### PUT `/users/:id`
Atualiza nome e/ou email (rota protegida).

#### DELETE `/users/:id`
Remove o usuário (rota protegida).

#### PATCH `/users/:id/password`
Altera a senha do usuário (rota protegida).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "currentPassword": "senhaAntiga123",
  "newPassword": "novaSenhaSegura456"
}
```

**Regras de Segurança:**
- O usuário só pode alterar sua própria senha
- É necessário fornecer a senha atual
- A nova senha deve ter pelo menos 6 caracteres

## 🔒 Segurança

- **Senhas criptografadas** com bcrypt
- **Autenticação JWT** com tempo de expiração
- **Validação de dados** com Zod
- **E-mails únicos** no sistema
- **Senhas nunca expostas** nas respostas
- **Middleware de autenticação** para rotas protegidas

## 🧪 Testes da API

### 🔍 Swagger UI - Documentação Interativa

1. **Acesse:** `http://localhost:3000/api-docs`
2. **Para rotas protegidas:**
   - Clique no botão **"Authorize"** (🔒)
   - Cole seu token JWT no campo
   - Clique **"Authorize"**
3. **Teste qualquer rota:**
   - Clique em **"Try it out"**
   - Preencha os dados necessários
   - Clique **"Execute"**


