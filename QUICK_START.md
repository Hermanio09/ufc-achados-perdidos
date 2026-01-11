# ⚡ Início Rápido

Guia rápido para executar o projeto em 5 minutos!

## 📦 1. Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## ⚙️ 2. Configurar Ambiente

```bash
# Backend - criar arquivo .env
cd backend
cp .env.example .env
```

Edite o arquivo `.env` se necessário (valores padrão funcionam).

## 🗄️ 3. Iniciar MongoDB

### Windows:
```bash
net start MongoDB
```

### Linux/MacOS:
```bash
sudo systemctl start mongodb
# ou
brew services start mongodb-community
```

## 🚀 4. Executar Aplicação

Abra **2 terminais**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Aguarde aparecer:
```
✅ MongoDB conectado
🚀 Servidor rodando na porta 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Aguarde aparecer o link:
```
➜  Local:   http://localhost:5173/
```

## 🌐 5. Acessar

Abra seu navegador em: **http://localhost:5173**

## 🎯 Testar

1. Clique em "CRIAR CONTA"
2. Preencha:
   - Nome: Seu Nome
   - Email: **teste@alu.ufc.br** (deve terminar em @alu.ufc.br)
   - Senha: 123456
   - Matrícula: 123456
   - Curso: Engenharia de Software
   - Semestre: 5

3. Faça login
4. Explore a plataforma!

## ❌ Problemas?

### MongoDB não iniciou:
```bash
# Instalar MongoDB primeiro
# Windows: https://www.mongodb.com/try/download/community
# Linux: sudo apt install mongodb
# MacOS: brew install mongodb-community
```

### Porta em uso:
```bash
# Matar processo na porta 5000 ou 5173
# Windows:
netstat -ano | findstr :5000
taskkill /PID [numero] /F

# Linux/MacOS:
lsof -ti:5000 | xargs kill -9
```

### Erro ao instalar dependências:
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📚 Precisa de mais ajuda?

Consulte: `INSTALACAO.md` (guia completo)

---

**Pronto! Você está rodando a aplicação! 🎉**
