# 🚀 Guia de Deploy no Render - Passo a Passo

Este guia vai te ajudar a fazer o deploy completo do seu site de casamento no Render.

## 📋 Pré-requisitos

1. Conta no [Render.com](https://render.com) (gratuita)
2. Código no GitHub (repositório público ou privado)
3. Conta no GitHub (se ainda não tiver)

---

## 🔧 PASSO 1: Preparar o Repositório no GitHub

### 1.1 Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `wedding-website` (ou o nome que preferir)
4. Marque como **Público** ou **Privado**
5. **NÃO** marque "Initialize with README"
6. Clique em "Create repository"

### 1.2 Fazer Upload do Código

**Opção A: Via Git (Recomendado)**

```bash
# No terminal, na pasta do projeto
cd C:\_MK\Dev\Wedding

# Inicializar git (se ainda não tiver)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Wedding website"

# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/wedding-website.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

**Opção B: Via Interface do GitHub**

1. No GitHub, clique em "uploading an existing file"
2. Arraste toda a pasta do projeto
3. Clique em "Commit changes"

---

## 🗄️ PASSO 2: Criar Banco de Dados PostgreSQL

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** no canto superior direito
3. Selecione **"PostgreSQL"**
4. Configure:
   - **Name**: `wedding-db` (ou outro nome)
   - **Database**: `wedding` (ou deixe o padrão)
   - **User**: Deixe o padrão
   - **Region**: Escolha a mais próxima (ex: `Oregon (US West)`)
   - **PostgreSQL Version**: Deixe a mais recente
   - **Plan**: **Free** (para testes)
5. Clique em **"Create Database"**
6. **IMPORTANTE**: Anote as informações:
   - **Internal Database URL** (você vai usar esta)
   - **External Database URL** (para conectar de fora, se necessário)

---

## ⚙️ PASSO 3: Deploy do Backend (FastAPI)

### 3.1 Criar Web Service

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório do GitHub:
   - Se for a primeira vez, autorize o Render a acessar seu GitHub
   - Selecione o repositório `wedding-website`
4. Configure o serviço:

**Configurações Básicas:**
- **Name**: `wedding-backend`
- **Region**: Mesma região do banco de dados
- **Branch**: `main` (ou `master`)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt && alembic upgrade head
  ```
- **Start Command**: 
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

### 3.2 Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

```
DATABASE_URL = <Cole aqui a Internal Database URL do passo 2>
```

```
JWT_SECRET = <Gere uma string aleatória longa, ex: minha-chave-secreta-super-segura-2024>
```

```
ADMIN_USERNAME = admin
```

```
ADMIN_PASSWORD = <Escolha uma senha forte>
```

```
CORS_ORIGINS = ["https://wedding-frontend.onrender.com"]
```
*(Você vai atualizar isso depois com a URL real do frontend)*

```
ENVIRONMENT = prod
```

### 3.3 Fazer Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build (pode levar 5-10 minutos)
3. Anote a URL gerada (ex: `https://wedding-backend-xxxx.onrender.com`)

---

## 🎨 PASSO 4: Deploy do Frontend (React)

### 4.1 Criar Static Site

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Static Site"**
3. Conecte o mesmo repositório do GitHub
4. Configure:

**Configurações:**
- **Name**: `wedding-frontend`
- **Branch**: `main` (ou `master`)
- **Root Directory**: `frontend`
- **Build Command**: 
  ```bash
  cd frontend && npm install && npm run build
  ```
- **Publish Directory**: `frontend/dist`

### 4.2 Configurar Variável de Ambiente

Na seção **"Environment Variables"**, adicione:

```
VITE_API_URL = https://wedding-backend-xxxx.onrender.com
```
*(Substitua pela URL real do seu backend do passo 3.3)*

### 4.3 Fazer Deploy

1. Clique em **"Create Static Site"**
2. Aguarde o build (pode levar 5-10 minutos)
3. Anote a URL gerada (ex: `https://wedding-frontend-xxxx.onrender.com`)

---

## 🔄 PASSO 5: Atualizar CORS do Backend

1. Volte para o serviço do backend no Render
2. Vá em **"Environment"**
3. Atualize a variável `CORS_ORIGINS`:
   ```
   CORS_ORIGINS = ["https://wedding-frontend-xxxx.onrender.com"]
   ```
   *(Substitua pela URL real do seu frontend)*
4. Clique em **"Save Changes"**
5. O Render vai reiniciar automaticamente o serviço

---

## ✅ PASSO 6: Testar o Deploy

### 6.1 Testar Frontend

1. Acesse a URL do frontend (ex: `https://wedding-frontend-xxxx.onrender.com`)
2. Verifique se a página carrega
3. Navegue pelas páginas

### 6.2 Testar Backend

1. Acesse: `https://wedding-backend-xxxx.onrender.com`
2. Deve aparecer: `{"message":"Wedding Website API"}`

### 6.3 Testar Admin Panel

1. Acesse: `https://wedding-frontend-xxxx.onrender.com/admin/login`
2. Faça login com:
   - **Username**: `admin` (ou o que você configurou)
   - **Password**: A senha que você configurou no `ADMIN_PASSWORD`

### 6.4 Testar Upload de Imagens

1. No admin panel, vá em "Gallery"
2. Tente fazer upload de uma imagem
3. Verifique se aparece na galeria pública

---

## 🐛 Solução de Problemas Comuns

### Problema: Backend não conecta ao banco

**Solução:**
- Verifique se a `DATABASE_URL` está correta
- Use a **Internal Database URL**, não a External
- Certifique-se de que o banco está na mesma região

### Problema: CORS Error no frontend

**Solução:**
- Verifique se `CORS_ORIGINS` no backend inclui a URL do frontend
- Certifique-se de que reiniciou o backend após mudar a variável
- A URL deve ser exata (com https://)

### Problema: Build do frontend falha

**Solução:**
- Verifique se `VITE_API_URL` está configurada
- Certifique-se de que o `package.json` está correto
- Veja os logs de build no Render

### Problema: Imagens não aparecem

**Solução:**
- Verifique se a pasta `static/uploads/` existe no backend
- No Render, você pode precisar criar essa pasta manualmente
- Verifique as permissões de escrita

### Problema: Admin não consegue fazer login

**Solução:**
- Verifique se `ADMIN_USERNAME` e `ADMIN_PASSWORD` estão corretos
- O usuário admin é criado automaticamente na primeira inicialização
- Se não funcionar, você pode precisar criar manualmente no banco

---

## 📝 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o GitHub
- [ ] Banco PostgreSQL criado no Render
- [ ] Backend deployado e funcionando
- [ ] Frontend deployado e funcionando
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente configuradas
- [ ] Admin panel acessível
- [ ] Upload de imagens funcionando
- [ ] Site público funcionando

---

## 🔗 URLs Importantes

Anote suas URLs aqui:

- **Backend**: `https://wedding-backend-xxxx.onrender.com`
- **Frontend**: `https://wedding-frontend-xxxx.onrender.com`
- **Admin Login**: `https://wedding-frontend-xxxx.onrender.com/admin/login`
- **Database URL**: (mantenha segura!)

---

## 💡 Dicas Extras

1. **Plano Free**: O Render pode "dormir" após 15 minutos de inatividade. A primeira requisição pode demorar ~30 segundos para "acordar".

2. **Logs**: Sempre verifique os logs no Render se algo não funcionar:
   - Backend: Dashboard → wedding-backend → Logs
   - Frontend: Dashboard → wedding-frontend → Logs

3. **Atualizações**: Sempre que fizer push no GitHub, o Render faz deploy automático.

4. **Backup**: O banco de dados free não tem backup automático. Considere fazer backups manuais importantes.

5. **Domínio Customizado**: Você pode adicionar seu próprio domínio nas configurações do Static Site.

---

## 🎉 Pronto!

Seu site de casamento está no ar! Compartilhe a URL do frontend com seus convidados.

**Precisa de ajuda?** Verifique os logs no Render ou revise este guia novamente.

