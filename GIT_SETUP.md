# 🚀 Configuração do Git e GitHub

Este guia vai te ajudar a enviar o código para o repositório: **https://github.com/MackKirk/WeddingWebsite**

## 📋 Opção 1: Usar o Script Automático (Windows)

1. **Execute o arquivo `setup-git.bat`** (duplo clique)
2. O script vai fazer tudo automaticamente
3. Se pedir autenticação, veja a seção "Autenticação" abaixo

## 📋 Opção 2: Usar o Script Automático (Mac/Linux)

1. Abra o terminal na pasta do projeto
2. Execute:
   ```bash
   chmod +x setup-git.sh
   ./setup-git.sh
   ```

## 📋 Opção 3: Comandos Manuais

Execute estes comandos no terminal, na pasta do projeto:

```bash
# 1. Inicializar Git (se ainda não tiver)
git init

# 2. Adicionar o repositório remoto
git remote add origin https://github.com/MackKirk/WeddingWebsite.git

# 3. Adicionar todos os arquivos
git add .

# 4. Fazer commit
git commit -m "Initial commit - Wedding Website Full Stack"

# 5. Enviar para o GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 Autenticação no GitHub

Se o GitHub pedir usuário e senha, você precisa usar um **Personal Access Token**:

### Como criar um Personal Access Token:

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Dê um nome: `Wedding Website Deploy`
4. Selecione as permissões:
   - ✅ `repo` (acesso completo aos repositórios)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (você só verá uma vez!)

### Usar o Token:

Quando o Git pedir:
- **Username**: Seu usuário do GitHub (`MackKirk`)
- **Password**: Cole o **Personal Access Token** (não sua senha normal)

---

## ✅ Verificar se Funcionou

1. Acesse: https://github.com/MackKirk/WeddingWebsite
2. Você deve ver todos os arquivos do projeto
3. Se aparecer, está tudo certo! ✅

---

## 🔄 Atualizações Futuras

Sempre que fizer mudanças, use:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

---

## 🐛 Problemas Comuns

### Erro: "remote origin already exists"

**Solução:**
```bash
git remote remove origin
git remote add origin https://github.com/MackKirk/WeddingWebsite.git
```

### Erro: "Authentication failed"

**Solução:**
- Use um Personal Access Token (veja seção acima)
- Ou configure SSH (mais avançado)

### Erro: "Nothing to commit"

**Solução:**
- Verifique se há arquivos para adicionar
- Execute `git status` para ver o estado

---

## 📝 Próximos Passos

Depois de enviar para o GitHub:

1. ✅ Código no GitHub
2. ⏭️ Criar banco PostgreSQL no Render
3. ⏭️ Deploy do Backend no Render
4. ⏭️ Deploy do Frontend no Render

Veja o arquivo `DEPLOY_RENDER_PT.md` para o deploy completo!

