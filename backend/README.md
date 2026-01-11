# Backend - API UFC Achados e Perdidos

API REST para a Plataforma de Achados e Perdidos do Campus Russas da UFC.

## Tecnologias

- Node.js 18+
- Express.js
- MongoDB + Mongoose
- JWT para autenticação
- Multer para upload de imagens
- Bcrypt para hash de senhas

## Estrutura

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuração MongoDB
│   ├── controllers/
│   │   ├── authController.js # Lógica de autenticação
│   │   └── itemsController.js # Lógica de itens
│   ├── models/
│   │   ├── User.js           # Model de usuário
│   │   └── Item.js           # Model de item
│   ├── routes/
│   │   ├── auth.js           # Rotas de autenticação
│   │   ├── items.js          # Rotas de itens
│   │   └── users.js          # Rotas de usuários
│   ├── middleware/
│   │   ├── auth.js           # Middleware de autenticação
│   │   └── upload.js         # Middleware de upload
│   └── server.js             # Entrada da aplicação
├── uploads/                  # Diretório de uploads
├── .env                      # Variáveis de ambiente
├── .env.example              # Exemplo de variáveis
└── package.json
```

## Instalação

```bash
# Instalar dependências
npm install

# Copiar .env
cp .env.example .env

# Configurar variáveis no .env

# Iniciar servidor
npm run dev
```

## Endpoints da API

### Autenticação

```http
POST   /api/auth/register    # Registrar usuário
POST   /api/auth/login        # Login
GET    /api/auth/me           # Perfil (autenticado)
```

### Itens

```http
GET    /api/items/found       # Listar itens encontrados
GET    /api/items/:id         # Detalhes de um item
POST   /api/items             # Criar item (autenticado)
GET    /api/items/user/my-items # Meus itens (autenticado)
POST   /api/items/:id/claim   # Reivindicar item (autenticado)
POST   /api/items/:id/return  # Confirmar devolução (autenticado)
```

### Usuários

```http
GET    /api/users/:id         # Perfil de usuário
PUT    /api/users/me          # Atualizar perfil (autenticado)
```

## Exemplos de Uso

### Registrar Usuário

```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao.silva@alu.ufc.br",
  "password": "senha123",
  "matricula": "123456",
  "curso": "Engenharia de Software",
  "semestre": "5"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "João Silva",
    "email": "joao.silva@alu.ufc.br",
    "role": "student",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao.silva@alu.ufc.br",
  "password": "senha123"
}
```

### Criar Item Encontrado

```javascript
POST /api/items
Authorization: Bearer {token}
Content-Type: multipart/form-data

title: "Fone JBL Preto"
description: "Fone bluetooth preto encontrado na biblioteca"
category: "Eletrônicos"
type: "found"
location: "Biblioteca - 2º andar"
inPortaria: true
image: [arquivo]
```

### Listar Itens Encontrados

```javascript
GET /api/items/found?category=Eletrônicos&location=Biblioteca

// Resposta
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

Para rotas protegidas, inclua o token no header:

```http
Authorization: Bearer {seu_token_aqui}
```

## Models

### User

```javascript
{
  name: String (required),
  email: String (required, unique, @alu.ufc.br),
  password: String (required, hashed),
  matricula: String (required, unique),
  curso: String (required),
  semestre: String,
  role: ['student', 'staff', 'admin'],
  reputation: Number (default: 0),
  totalReturns: Number (default: 0),
  createdAt: Date
}
```

### Item

```javascript
{
  title: String (required),
  description: String,
  category: ['Eletrônicos', 'Documentos', 'Chaves', ...],
  type: ['lost', 'found'] (required),
  status: ['active', 'claimed', 'returned', 'archived'],
  location: String (required),
  image: String,
  inPortaria: Boolean (default: false),
  user: ObjectId (ref: User),
  claimedBy: ObjectId (ref: User),
  claimedAt: Date,
  returnedAt: Date,
  createdAt: Date
}
```

## Variáveis de Ambiente

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ufc-achados-perdidos
JWT_SECRET=sua-chave-secreta-aqui
FRONTEND_URL=http://localhost:5173
```

## Testando

```bash
# Testar saúde da API
curl http://localhost:5000/

# Registrar usuário
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@alu.ufc.br","password":"123456","matricula":"123456","curso":"ES"}'
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Contribuindo

Este é um projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Web.
