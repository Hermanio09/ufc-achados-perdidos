# 🎓 UFC Achados e Perdidos - Campus Russas

Plataforma web para conectar estudantes que perderam ou encontraram objetos no Campus Russas da UFC, aumentando a taxa de recuperação de itens de 30-40% para +70%.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como Trabalho Final da disciplina **Desenvolvimento de Software para Web** utilizando a metodologia **Design Thinking**.

### Problema
- Atualmente 60-70% dos itens perdidos não são recuperados
- Mais de 500 itens por ano passam pela portaria
- Processo manual via caderno físico
- Falta de comunicação entre quem perde e quem encontra

### Solução
Plataforma digital que:
- Permite cadastro de itens perdidos e encontrados
- Sistema de notificações automáticas
- Chat entre usuários para verificação
- Galeria visual de itens
- Painel administrativo para a portaria

## 👥 Personas

**Lucas Oliveira** - Estudante que perde itens
- Busca rapidez e clareza
- Quer ser notificado automaticamente
- Prefere processos visuais

**Jayelly Santos** - Estudante que encontra itens
- Quer feedback sobre devoluções
- Precisa de segurança na entrega
- Valoriza reconhecimento

## 🚀 Tecnologias

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- Socket.io Client

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Socket.io
- Cloudinary (upload de imagens)

## 📦 Estrutura do Projeto

```
ufc-achados-perdidos/
├── frontend/          # Aplicação React
├── backend/           # API Node.js
├── docs/              # Documentação Design Thinking
└── README.md
```

## ⚙️ Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run dev
```

## 🎨 Design System

### Cores
- Azul UFC: `#004C8C` (Primária)
- Azul Claro: `#0066CC` (Links)
- Verde: `#28A745` (Sucesso)
- Amarelo: `#FFC107` (Alerta)
- Vermelho: `#DC3545` (Erro)

### Tipografia
- Títulos: Inter Bold
- Corpo: Inter Regular
- Legendas: Inter Light

## 📱 Funcionalidades

### Para Estudantes
- [x] Cadastro com email institucional (@alu.ufc.br)
- [x] Registrar item perdido
- [x] Registrar item encontrado (com foto)
- [x] Buscar e filtrar itens
- [x] Chat com outros usuários
- [x] Receber notificações de matches
- [x] Histórico de itens

### Para Portaria
- [x] Painel administrativo
- [x] Busca rápida de itens
- [x] Confirmação de entregas
- [x] Estatísticas gerais

## 📊 Requisitos Funcionais

- **RF01** - Autenticação e Cadastro
- **RF02** - Registro de Itens Perdidos
- **RF03** - Registro de Itens Encontrados
- **RF04** - Busca e Visualização
- **RF05** - Comunicação e Matching
- **RF06** - Verificação e Devolução
- **RF07** - Notificações
- **RF08** - Perfil e Histórico
- **RF09** - Administração (Portaria)

## 🎯 Regras de Negócio

- Apenas usuários com vínculo UFC podem acessar
- Itens encontrados devem ter foto obrigatória
- Itens não reclamados após 90 dias são arquivados
- Chat liberado após manifestação de interesse
- Máximo 10 itens perdidos ativos por usuário

## 🌐 Deploy

- **Frontend**: Vercel
- **Backend**: Render
- **Banco de Dados**: Supabase PostgreSQL

## 📚 Documentação

Todos os artefatos do Design Thinking estão disponíveis em `/docs`:
- Documento de Imersão e Ideação
- Protótipos de Alta Fidelidade
- Lista Completa de Requisitos

## 👨‍💻 Autor

**Hermanio Santana Chaves**
- Engenharia de Software - UFC Campus Russas

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

🤖 Desenvolvido com [Claude Code](https://claude.com/claude-code)
