# Guia de Deploy - UFC Achados e Perdidos

Este guia detalha como colocar a aplicação online usando serviços gratuitos.

## O que você vai precisar

- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (grátis)
- Conta no [Render](https://render.com/) (grátis)
- Conta no [Vercel](https://vercel.com/) (grátis)
- Repositório GitHub: https://github.com/Hermanio09/ufc-achados-perdidos

## Passo 1: Configurar MongoDB Atlas

### 1.1 Criar Conta e Cluster

1. Acesse https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Escolha **M0 Sandbox** (FREE)
4. Região: **São Paulo (sa-east-1)** ou mais próxima
5. Nome do cluster: `ufc-achados-perdidos`

### 1.2 Configurar Acesso

1. **Database Access:**
   - Clique em "Database Access" no menu lateral
   - "Add New Database User"
   - Username: `ufcadmin`
   - Password: Gere uma senha segura (GUARDE ESSA SENHA!)
   - Privileges: "Read and write to any database"
   - Add User

2. **Network Access:**
   - Clique em "Network Access"
   - "Add IP Address"
   - Selecione "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

### 1.3 Obter String de Conexão

1. Volte para "Database" (menu lateral)
2. Clique em "Connect" no seu cluster
3. Escolha "Connect your application"
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copie a connection string:
   ```
   mongodb+srv://ufcadmin:<password>@ufc-achados-perdidos.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANTE:** Substitua `<password>` pela senha que você criou
7. Adicione o nome do banco no final:
   ```
   mongodb+srv://ufcadmin:SUASENHA@ufc-achados-perdidos.xxxxx.mongodb.net/ufc-achados-perdidos?retryWrites=true&w=majority
   ```

**GUARDE ESSA STRING!** Você vai precisar dela.

## Passo 2: Deploy do Backend (Render)

### 2.1 Criar Conta no Render

1. Acesse https://render.com/
2. Clique em "Get Started"
3. Faça login com GitHub (recomendado)
4. Autorize o Render a acessar seus repositórios

### 2.2 Criar Web Service

1. No Dashboard, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório: `Hermanio09/ufc-achados-perdidos`
4. Configure:
   - **Name:** `ufc-achados-perdidos-api`
   - **Region:** Oregon (US West) - grátis
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### 2.3 Configurar Environment Variables

Na seção "Environment Variables", adicione:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://ufcadmin:SUASENHA@ufc-achados-perdidos.xxxxx.mongodb.net/ufc-achados-perdidos?retryWrites=true&w=majority
JWT_SECRET=ufc-achados-perdidos-super-secret-key-2025-production
FRONTEND_URL=https://seuapp.vercel.app
```

**IMPORTANTE:**
- Substitua `MONGODB_URI` pela string do MongoDB Atlas (Passo 1.3)
- `FRONTEND_URL` será atualizado depois do deploy do frontend (Passo 3)
- `JWT_SECRET` deve ser uma string aleatória e segura

### 2.4 Deploy

1. Clique em "Create Web Service"
2. Aguarde o deploy (3-5 minutos)
3. Quando aparecer "Live", seu backend está online!
4. **COPIE A URL:** `https://ufc-achados-perdidos-api.onrender.com`

### 2.5 Testar API

```bash
curl https://ufc-achados-perdidos-api.onrender.com/
```

Deve retornar:
```json
{
  "message": "API UFC Achados e Perdidos está funcionando!",
  "version": "1.0.0"
}
```

## Passo 3: Deploy do Frontend (Vercel)

### 3.1 Criar Conta no Vercel

1. Acesse https://vercel.com/signup
2. Faça login com GitHub
3. Autorize o Vercel

### 3.2 Importar Projeto

1. No Dashboard, clique em "Add New..." > "Project"
2. Selecione o repositório: `Hermanio09/ufc-achados-perdidos`
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3.3 Configurar Environment Variable

Na seção "Environment Variables", adicione:

```
VITE_API_URL=https://ufc-achados-perdidos-api.onrender.com/api
```

**IMPORTANTE:** Use a URL do backend do Passo 2.4 e adicione `/api` no final!

### 3.4 Deploy

1. Clique em "Deploy"
2. Aguarde o deploy (1-2 minutos)
3. Quando aparecer "Congratulations", clique em "Visit"
4. **COPIE A URL:** `https://ufc-achados-perdidos.vercel.app`

### 3.5 Atualizar Backend com URL do Frontend

1. Volte ao Render (https://dashboard.render.com/)
2. Clique no seu serviço `ufc-achados-perdidos-api`
3. Vá em "Environment"
4. Edite `FRONTEND_URL` e coloque a URL do Vercel:
   ```
   FRONTEND_URL=https://ufc-achados-perdidos.vercel.app
   ```
5. Clique em "Save Changes"
6. O serviço vai reiniciar automaticamente

## Passo 4: Testar Aplicação

1. Acesse a URL do Vercel: `https://ufc-achados-perdidos.vercel.app`
2. Clique em "CRIAR CONTA"
3. Preencha:
   - Nome: Teste
   - Email: `teste@alu.ufc.br`
   - Senha: 123456
   - Matrícula: 123456
   - Curso: Engenharia de Software
   - Semestre: 5
4. Faça login
5. Teste criar um item encontrado

**Se tudo funcionar, parabéns! Sua aplicação está online!**

## Passo 5: Atualizar README com Links

Edite o `README.md` do repositório e adicione:

```markdown
## Aplicação Online

- **Frontend:** https://ufc-achados-perdidos.vercel.app
- **API:** https://ufc-achados-perdidos-api.onrender.com
- **Repositório:** https://github.com/Hermanio09/ufc-achados-perdidos
```

Faça commit e push:

```bash
git add README.md
git commit -m "docs: adicionar links da aplicação online"
git push origin main
```

## Problemas Comuns

### Backend não conecta ao MongoDB

**Erro:** `MongoNetworkError` ou `Authentication failed`

**Solução:**
- Verifique se a senha no `MONGODB_URI` está correta
- Confirme que o IP 0.0.0.0/0 está liberado no MongoDB Atlas (Network Access)
- Verifique se o nome do banco está na connection string

### Frontend não conecta ao Backend

**Erro:** `Network Error` ou `CORS error`

**Solução:**
- Verifique se `VITE_API_URL` está correto no Vercel
- Confirme que `FRONTEND_URL` está correto no Render
- Teste a API diretamente: `curl https://sua-api.onrender.com/`

### Render está "dormindo"

**Comportamento:** Primeira requisição demora 30-50 segundos

**Explicação:** Plano gratuito do Render "dorme" após 15 minutos de inatividade

**Solução:** É normal. Após a primeira requisição, fica rápido.

### Erro ao fazer upload de imagem

**Erro:** `PayloadTooLargeError` ou `413`

**Solução:**
- Limite de 5MB está configurado no backend
- Reduza o tamanho da imagem antes de enviar
- Use ferramentas como: https://tinypng.com/

## Segurança

### Importante para Produção:

1. **NUNCA** commite arquivos `.env` com credenciais reais
2. Use `JWT_SECRET` forte e aleatório
3. MongoDB: Crie usuário específico (não use admin)
4. Render: Habilite "Auto-Deploy" somente para branch `main`
5. Vercel: Habilite proteção de preview deployments

## Monitoramento

### Render:
- Dashboard > Logs: Ver logs em tempo real
- Dashboard > Metrics: Uso de CPU/RAM

### Vercel:
- Dashboard > Analytics: Visitas, performance
- Dashboard > Deployments: Histórico de deploys

### MongoDB Atlas:
- Dashboard > Metrics: Conexões, operações, storage

## Suporte

Se encontrar problemas:

1. **Logs do Backend (Render):**
   - Dashboard > seu serviço > Logs
   - Procure por erros em vermelho

2. **Logs do Frontend (Vercel):**
   - Dashboard > seu projeto > Deployments > última deploy > View Function Logs

3. **MongoDB Atlas:**
   - Dashboard > Network Access (liberar IP)
   - Dashboard > Database Access (verificar usuário)

## Recursos Adicionais

- [Documentação Render](https://render.com/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)

## Entrega do Trabalho

Para entregar o trabalho, forneça:

1. **Link do Repositório GitHub:**
   ```
   https://github.com/Hermanio09/ufc-achados-perdidos
   ```

2. **Link da Aplicação Online (Frontend):**
   ```
   https://ufc-achados-perdidos.vercel.app
   ```

3. **Link da API (Backend):**
   ```
   https://ufc-achados-perdidos-api.onrender.com
   ```

---

**Boa sorte com o deploy!**
