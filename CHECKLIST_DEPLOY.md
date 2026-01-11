# ✅ CHECKLIST DE DEPLOY - PARA FAZER HOJE!

**Data:** 11/01/2026
**Prazo:** Antes da apresentação (12/01/2026)
**Tempo estimado:** 1 hora

---

## 📦 SITUAÇÃO ATUAL

✅ **Arquivos de configuração:** Prontos!
- `frontend/vercel.json` ✅
- `backend/render.yaml` ✅
- `.env.example` (ambos) ✅
- `DEPLOY.md` (guia completo) ✅

⚠️ **Arquivos novos não commitados:**
- `frontend/src/pages/Chat.jsx` ⭐ NOVO
- `frontend/src/pages/Profile.jsx` ⭐ NOVO
- `frontend/src/pages/Notifications.jsx` ⭐ NOVO
- `frontend/src/components/Sidebar.jsx` ⭐ NOVO
- Outras modificações

---

## 🚀 PASSO A PASSO RÁPIDO

### ETAPA 1: COMMITAR ALTERAÇÕES (5 minutos)

```bash
# 1. Ir para o diretório do projeto
cd "C:\Users\Hermanio Santana\ufc-achados-perdidos"

# 2. Adicionar todas as mudanças
git add .

# 3. Fazer commit
git commit -m "feat: adicionar páginas de Chat, Perfil e Notificações - versão final para apresentação"

# 4. Enviar para GitHub
git push origin main
```

**✅ CHECKPOINT:** Acesse https://github.com/Hermanio09/ufc-achados-perdidos e confirme que os arquivos foram enviados.

---

### ETAPA 2: MONGODB ATLAS (10 minutos)

#### Opção A: Se você JÁ TEM conta no MongoDB Atlas
- [ ] Fazer login em https://cloud.mongodb.com/
- [ ] Usar cluster existente OU criar novo cluster M0 (FREE)
- [ ] Copiar connection string
- [ ] **ANOTAR:** `mongodb+srv://usuario:senha@cluster.mongodb.net/ufc-achados-perdidos`

#### Opção B: Se você NÃO TEM conta
- [ ] Criar conta em https://www.mongodb.com/cloud/atlas/register
- [ ] Escolher **M0 Sandbox** (GRÁTIS)
- [ ] Região: São Paulo (sa-east-1)
- [ ] Criar usuário do banco:
  - Username: `ufcadmin`
  - Password: **GERAR SENHA FORTE** (anotar!)
- [ ] Network Access: **Allow Access from Anywhere (0.0.0.0/0)**
- [ ] Copiar connection string e substituir:
  - `<password>` pela sua senha
  - Adicionar `/ufc-achados-perdidos` antes de `?retryWrites`

**Exemplo final:**
```
mongodb+srv://ufcadmin:SuaSenhaAqui123@cluster0.xxxxx.mongodb.net/ufc-achados-perdidos?retryWrites=true&w=majority
```

**✅ CHECKPOINT:** Guardar essa string! Você vai usar no próximo passo.

---

### ETAPA 3: DEPLOY BACKEND NO RENDER (15 minutos)

1. **Acessar Render**
   - [ ] Ir para https://render.com/
   - [ ] Fazer login com GitHub
   - [ ] Autorizar acesso aos repositórios

2. **Criar Web Service**
   - [ ] Dashboard > "New +" > "Web Service"
   - [ ] Conectar repositório: `Hermanio09/ufc-achados-perdidos`
   - [ ] Configurar:
     ```
     Name: ufc-achados-perdidos-api
     Region: Oregon (US West)
     Branch: main
     Root Directory: backend
     Runtime: Node
     Build Command: npm install
     Start Command: npm start
     Instance Type: Free
     ```

3. **Variáveis de Ambiente**

   Adicionar TODAS estas variáveis:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://ufcadmin:SUASENHA@cluster0.xxxxx.mongodb.net/ufc-achados-perdidos?retryWrites=true&w=majority
   JWT_SECRET=ufc-achados-perdidos-jwt-secret-key-super-segura-2026-producao
   FRONTEND_URL=https://TEMPORARIO.vercel.app
   ```

   **IMPORTANTE:**
   - Substituir `MONGODB_URI` pela string do MongoDB Atlas
   - `FRONTEND_URL` será atualizado depois (deixe temporário por enquanto)

4. **Deploy**
   - [ ] Clicar "Create Web Service"
   - [ ] Aguardar 3-5 minutos (vai aparecer barra de progresso)
   - [ ] Quando status = "Live" 🟢, copiar a URL

**✅ CHECKPOINT:** Testar API
```bash
curl https://SUA-URL.onrender.com/
```
Deve retornar JSON com "message": "API está funcionando"

**📝 ANOTAR URL DA API:** `https://_______________onrender.com`

---

### ETAPA 4: DEPLOY FRONTEND NO VERCEL (10 minutos)

1. **Acessar Vercel**
   - [ ] Ir para https://vercel.com/signup
   - [ ] Fazer login com GitHub
   - [ ] Autorizar acesso

2. **Importar Projeto**
   - [ ] Dashboard > "Add New..." > "Project"
   - [ ] Selecionar: `Hermanio09/ufc-achados-perdidos`
   - [ ] Configurar:
     ```
     Framework Preset: Vite
     Root Directory: frontend
     Build Command: npm run build
     Output Directory: dist
     ```

3. **Variável de Ambiente**

   Adicionar APENAS esta variável:

   ```
   VITE_API_URL=https://SUA-URL-DO-RENDER.onrender.com/api
   ```

   **IMPORTANTE:** Usar a URL do backend (Etapa 3) + `/api` no final!

4. **Deploy**
   - [ ] Clicar "Deploy"
   - [ ] Aguardar 1-2 minutos
   - [ ] Quando aparecer "Congratulations" 🎉, clicar "Visit"

**✅ CHECKPOINT:** Acessar a URL e ver a tela de Login

**📝 ANOTAR URL DO FRONTEND:** `https://_______________.vercel.app`

---

### ETAPA 5: CONECTAR FRONTEND ↔ BACKEND (5 minutos)

**Agora que temos ambas as URLs, vamos conectá-las:**

1. **Atualizar FRONTEND_URL no Backend**
   - [ ] Voltar ao Render: https://dashboard.render.com/
   - [ ] Clicar no serviço `ufc-achados-perdidos-api`
   - [ ] Menu lateral > "Environment"
   - [ ] Editar variável `FRONTEND_URL`
   - [ ] Colocar: `https://sua-url.vercel.app` (SEM barra no final)
   - [ ] "Save Changes"
   - [ ] Aguardar restart automático (~30s)

**✅ CHECKPOINT:** Serviço reiniciou e status = "Live" 🟢

---

### ETAPA 6: TESTAR APLICAÇÃO ONLINE (10 minutos)

Acesse a URL do Vercel e teste:

1. **Teste de Cadastro**
   - [ ] Clicar em "CRIAR CONTA"
   - [ ] Preencher dados:
     - Nome: Teste Demo
     - Email: `teste@alu.ufc.br`
     - Senha: `teste123`
     - Matrícula: `123456`
     - Curso: Engenharia de Software
     - Semestre: 5º
   - [ ] "CONTINUAR" até finalizar
   - [ ] Deve redirecionar para login

2. **Teste de Login**
   - [ ] Email: `teste@alu.ufc.br`
   - [ ] Senha: `teste123`
   - [ ] "ENTRAR"
   - [ ] Deve abrir a tela Home com feed de itens

3. **Teste de Navegação**
   - [ ] Clicar no menu hamburguer (☰) → Sidebar abre
   - [ ] Clicar no sininho (🔔) → Notificações abrem
   - [ ] Clicar em Chat (💬) → Página de chat abre
   - [ ] Clicar em Perfil (👤) → Página de perfil abre

4. **Teste de Cadastro de Item**
   - [ ] Clicar em "+ REGISTRAR"
   - [ ] Escolher "ENCONTREI ALGO"
   - [ ] Preencher formulário
   - [ ] Fazer upload de foto
   - [ ] "REGISTRAR ITEM"
   - [ ] Deve mostrar confirmação

**SE TODOS OS TESTES PASSARAM: 🎉 PARABÉNS! Aplicação está online!**

---

### ETAPA 7: ATUALIZAR REPOSITÓRIO COM LINKS (5 minutos)

Editar o arquivo `README.md`:

```bash
cd "C:\Users\Hermanio Santana\ufc-achados-perdidos"
```

Adicionar no topo do README (abaixo do título):

```markdown
## 🌐 Aplicação Online

- **Frontend:** https://sua-url.vercel.app
- **Backend API:** https://sua-url.onrender.com
- **Repositório:** https://github.com/Hermanio09/ufc-achados-perdidos
- **Documentação:** [DEPLOY.md](./DEPLOY.md)
```

Commitar:

```bash
git add README.md
git commit -m "docs: adicionar links da aplicação online"
git push origin main
```

---

## 📋 LINKS PARA ENTREGAR

**Copie e cole esses 2 links no trabalho:**

1. **Link do Repositório GitHub:**
   ```
   https://github.com/Hermanio09/ufc-achados-perdidos
   ```

2. **Link da Aplicação Publicada:**
   ```
   https://_______________vercel.app
   ```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### ❌ Problema 1: "API não responde" / "Network Error"

**Causa:** Backend não está acessível

**Solução:**
1. Testar API diretamente: `curl https://sua-api.onrender.com/`
2. Verificar logs no Render: Dashboard > Logs
3. Confirmar que `MONGODB_URI` está correto
4. Verificar se MongoDB Atlas liberou IP 0.0.0.0/0

---

### ❌ Problema 2: "Login não funciona" / "Erro 500"

**Causa:** MongoDB não conectado OU JWT_SECRET inválido

**Solução:**
1. Render > Logs > Procurar erro `MongoNetworkError`
2. Verificar variável `MONGODB_URI` (tem que incluir senha e nome do banco)
3. Verificar `JWT_SECRET` (não pode estar vazio)
4. Restartar serviço: Render > Manual Deploy > "Clear build cache & deploy"

---

### ❌ Problema 3: "CORS Error" no console do browser

**Causa:** `FRONTEND_URL` não está correto no backend

**Solução:**
1. Render > Environment > Verificar `FRONTEND_URL`
2. Deve ser a URL do Vercel EXATA (sem / no final)
3. Salvar e aguardar restart
4. Limpar cache do browser (Ctrl+Shift+R)

---

### ❌ Problema 4: "Build failed" no Vercel

**Causa:** Erro no código ou dependências

**Solução:**
1. Vercel > Deployments > Ver logs do build
2. Procurar linha com erro (geralmente em vermelho)
3. Erros comuns:
   - Faltou algum import
   - Componente não exportado corretamente
   - Variável de ambiente não configurada

**Se for erro de import:**
```bash
# Testar localmente primeiro:
cd frontend
npm run build

# Se funcionar local, fazer redeploy:
git push origin main
```

---

### ❌ Problema 5: "Backend está muito lento" (30-50 segundos)

**Causa:** Render FREE tier "dorme" após 15 min de inatividade

**Solução:**
- Isso é **NORMAL** no plano gratuito
- Primeira requisição demora, depois fica rápido
- Para apresentação: abrir a aplicação 2-3 minutos antes para "acordar" o backend

**Dica:** Antes da demo, fazer 1 login teste para garantir que está rápido.

---

## 🎯 CHECKLIST FINAL PARA APRESENTAÇÃO

Antes de apresentar amanhã (12/01), confirme:

- [ ] ✅ Aplicação está no ar (frontend + backend)
- [ ] ✅ Login funciona
- [ ] ✅ Cadastro funciona
- [ ] ✅ Pode criar item encontrado
- [ ] ✅ Busca e filtros funcionam
- [ ] ✅ Chat abre
- [ ] ✅ Perfil abre
- [ ] ✅ Notificações abrem
- [ ] ✅ Menu hamburguer funciona
- [ ] ✅ Links no README estão corretos
- [ ] ✅ Repositório GitHub está atualizado
- [ ] ✅ Testado em outro dispositivo/navegador

---

## 📱 DEMONSTRAÇÃO SUGERIDA (3 minutos)

**Roteiro para apresentação:**

1. **"Vejam a aplicação online"** (10s)
   - Mostrar URL no navegador
   - Mencionar que está no Vercel + Render

2. **"Vou criar uma conta"** (30s)
   - Cadastro rápido
   - Login

3. **"Feed de itens encontrados"** (20s)
   - Mostrar galeria
   - Testar busca

4. **"Navegação completa"** (30s)
   - Menu lateral
   - Chat
   - Notificações
   - Perfil

5. **"Cadastrar item"** (40s)
   - Upload de foto
   - Preencher formulário
   - Confirmar cadastro
   - Voltar e ver no feed

6. **"Responsividade"** (20s)
   - Redimensionar janela (F12)
   - Mostrar layout mobile

7. **"Próximos passos"** (20s)
   - Integração com WebSocket (chat tempo real)
   - Sistema de matching automático
   - Notificações push

**TOTAL: ~3 minutos**

---

## 🆘 SUPORTE DE EMERGÊNCIA

Se algo der errado NA HORA da apresentação:

### Plano B: Mostrar versão local

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Abrir: http://localhost:5173

**Justificativa:** "Temos a versão online, mas por precaução vou demonstrar localmente para garantir performance."

### Plano C: Slides + Vídeo

- Ter prints de todas as telas
- Ter vídeo curto (30s) mostrando navegação
- Explicar que está online e passar os links

---

## ✅ STATUS ATUAL

**Cobertura de Requisitos:** ~65% implementado

**Funcionalidades FUNCIONANDO:**
- ✅ Login/Cadastro (RF01)
- ✅ Registro de Itens Encontrados (RF03)
- ✅ Busca e Visualização (RF04)
- ✅ Chat (RF05 - UI completa)
- ✅ Perfil e Histórico (RF08 - parcial)
- ✅ Notificações (RF07 - UI completa)

**Funcionalidades PENDENTES (mencionar como "próximos passos"):**
- ⏳ Registro de Itens Perdidos (falta página específica)
- ⏳ Verificação de Propriedade (perguntas de segurança)
- ⏳ Painel Administrativo da Portaria
- ⏳ Matching automático
- ⏳ WebSocket para chat tempo real

---

## 📞 CONTATO DE EMERGÊNCIA

**Se travar no deploy e precisar de ajuda:**

- Render Support: https://render.com/docs
- Vercel Support: https://vercel.com/docs
- MongoDB Atlas Support: https://www.mongodb.com/docs/atlas/

---

**BOA SORTE NO DEPLOY E NA APRESENTAÇÃO! 🚀✨**
