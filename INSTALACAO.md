# 📦 Guia de Instalação e Execução

Este guia explica passo a passo como instalar e executar a Plataforma de Achados e Perdidos localmente.

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** 18 ou superior ([Download](https://nodejs.org/))
- **MongoDB** 6 ou superior ([Download](https://www.mongodb.com/try/download/community))
- **npm** (já vem com Node.js) ou **yarn**
- **Git** ([Download](https://git-scm.com/))

## 🚀 Instalação

### 1. Clone o repositório

```bash
cd ufc-achados-perdidos
```

### 2. Instalar MongoDB

#### Windows:
1. Baixe o MongoDB Community Server
2. Instale com as configurações padrão
3. O MongoDB iniciará automaticamente como serviço

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### MacOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 3. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env e configurar as variáveis
# Você pode usar um editor como nano, vim ou VSCode
```

**Arquivo `.env` (backend):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ufc-achados-perdidos
JWT_SECRET=minha-chave-secreta-super-segura-123
FRONTEND_URL=http://localhost:5173
```

### 4. Configurar Frontend

```bash
cd ../frontend

# Instalar dependências
npm install
```

## ▶️ Executar o Projeto

### Opção 1: Executar Backend e Frontend Separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Você verá:
```
🚀 Servidor rodando na porta 5000
✅ MongoDB conectado: localhost
📍 Ambiente: development
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Você verá:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Opção 2: Usar Script (Recomendado para Windows)

Crie um arquivo `start.bat` na raiz do projeto:

```bat
@echo off
echo Iniciando UFC Achados e Perdidos...
echo.

start cmd /k "cd backend && npm run dev"
timeout /t 3
start cmd /k "cd frontend && npm run dev"

echo.
echo Servidor backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
```

Execute:
```bash
start.bat
```

## 🌐 Acessar a Aplicação

Abra seu navegador e acesse:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000

## 🧪 Testar a API

### Com cURL:

**Criar usuário:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Silva",
    "email": "teste@alu.ufc.br",
    "password": "123456",
    "matricula": "123456",
    "curso": "Engenharia de Software",
    "semestre": "5"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@alu.ufc.br",
    "password": "123456"
  }'
```

### Com Postman/Insomnia:

1. Importe as requisições
2. Configure a URL base: `http://localhost:5000/api`
3. Teste os endpoints

## 📱 Primeiro Acesso

1. Acesse http://localhost:5173
2. Clique em "CRIAR CONTA"
3. Preencha os dados (use email @alu.ufc.br)
4. Faça login
5. Explore a plataforma!

## 🐛 Problemas Comuns

### MongoDB não está rodando

**Erro:** `MongoNetworkError: connect ECONNREFUSED`

**Solução:**
```bash
# Windows
net start MongoDB

# Linux
sudo systemctl start mongodb

# MacOS
brew services start mongodb-community
```

### Porta já em uso

**Erro:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solução:**
- Mude a porta no `.env` do backend
- Ou finalize o processo que está usando a porta

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

**Linux/MacOS:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Dependências não instaladas

**Erro:** `Module not found`

**Solução:**
```bash
# Deletar node_modules e package-lock.json
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Reiniciar do Zero

Se algo der muito errado:

```bash
# Parar todos os serviços
# Ctrl+C nos terminais

# Limpar banco de dados
mongo ufc-achados-perdidos --eval "db.dropDatabase()"

# Limpar dependências
cd backend && rm -rf node_modules package-lock.json
cd ../frontend && rm -rf node_modules package-lock.json

# Reinstalar
cd backend && npm install
cd ../frontend && npm install

# Iniciar novamente
```

## 📚 Estrutura de Pastas

```
ufc-achados-perdidos/
├── backend/
│   ├── src/
│   │   ├── config/        # Configurações
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── models/        # Models do MongoDB
│   │   ├── routes/        # Rotas da API
│   │   ├── middleware/    # Middlewares
│   │   └── server.js      # Entrada do backend
│   ├── uploads/           # Imagens enviadas
│   ├── .env              # Variáveis de ambiente
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── services/      # Serviços (API calls)
│   │   ├── contexts/      # Contexts
│   │   └── App.jsx        # Componente raiz
│   ├── public/           # Arquivos estáticos
│   └── package.json
│
├── docs/                 # Documentação Design Thinking
└── README.md             # Documentação principal
```

## 🆘 Suporte

Se você encontrar problemas:

1. Verifique se todos os pré-requisitos estão instalados
2. Confira se o MongoDB está rodando
3. Verifique as portas (5000 e 5173)
4. Consulte os logs do terminal
5. Leia a mensagem de erro completa

## ✅ Checklist

- [ ] Node.js instalado
- [ ] MongoDB instalado e rodando
- [ ] Dependências do backend instaladas
- [ ] Dependências do frontend instaladas
- [ ] Arquivo .env configurado
- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 5173
- [ ] Consegue acessar http://localhost:5173
- [ ] Consegue criar conta
- [ ] Consegue fazer login

---

**Bom desenvolvimento! 🚀**
