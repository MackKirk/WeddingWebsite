# 🔧 Solução: Serviço Ficando Iniciando e Fechando

O problema geralmente é causado por:
1. Erro no código que faz o servidor crashar
2. Frontend não buildado corretamente
3. Caminho do frontend_dist errado
4. Erro no startup

---

## ✅ Correções Aplicadas

### 1. Caminho do Frontend Corrigido
- Agora tenta múltiplos caminhos possíveis
- Funciona mesmo se o build estiver em lugares diferentes

### 2. Tratamento de Erros Melhorado
- Startup não crasha mais se houver erro
- Frontend opcional (servidor funciona mesmo sem ele)

### 3. Ordem das Rotas Corrigida
- Rotas da API vêm primeiro
- Catch-all do frontend vem por último

---

## 🔍 Como Ver os Logs no Render

1. Acesse: https://dashboard.render.com
2. Vá no seu serviço `wedding-website`
3. Clique em **"Logs"**
4. Veja os erros que estão aparecendo

---

## 🐛 Problemas Comuns e Soluções

### Erro: "ModuleNotFoundError"
**Solução**: Verifique se todas as dependências estão no `requirements.txt`

### Erro: "Frontend not built"
**Solução**: O build do frontend falhou. Verifique:
- Node.js está instalado no build
- `npm install` está funcionando
- `npm run build` está criando `backend/frontend_dist/`

### Erro: "Database connection failed"
**Solução**: 
- Verifique se `DATABASE_URL` está correta
- Use a **Internal Database URL** (não a External)

### Erro: "Port already in use"
**Solução**: Use `$PORT` no start command (já está correto)

---

## 📋 Build Command Verificado

Certifique-se que está assim no Render:

```bash
cd frontend && npm install && npm run build && cd .. && pip install -r backend/requirements.txt && cd backend && alembic upgrade head
```

**Importante**: 
- Deve instalar Node primeiro (npm install)
- Depois buildar o frontend
- Depois instalar Python
- Por último rodar migrations

---

## 🔄 Teste Local Primeiro

Antes de fazer deploy, teste localmente:

```bash
# Build
cd frontend
npm install
npm run build
cd ..

# Verificar se frontend_dist foi criado
ls backend/frontend_dist/

# Rodar backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Se funcionar local, deve funcionar no Render!

---

## ⚙️ Configuração Final no Render

### Build Command:
```bash
cd frontend && npm install && npm run build && cd .. && pip install -r backend/requirements.txt && cd backend && alembic upgrade head
```

### Start Command:
```bash
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Variáveis de Ambiente:
```
DATABASE_URL = postgresql://weddingwebsite_bsbs_user:eLXkbiVBfawT9ymi7GwuMu1VTglc71zw@dpg-d4p24i63jp1c73dqe1gg-a/weddingwebsite_bsbs
JWT_SECRET = sua-chave-secreta
ADMIN_USERNAME = admin
ADMIN_PASSWORD = sua-senha
CORS_ORIGINS = ["https://weddingwebsite-1.onrender.com"]
ENVIRONMENT = prod
```

---

## 🚀 Próximos Passos

1. **Faça commit das correções**:
   ```bash
   git add backend/app/main.py
   git commit -m "Fix: Improve error handling and frontend path detection"
   git push
   ```

2. **No Render**:
   - O deploy vai reiniciar automaticamente
   - Veja os logs para verificar se está funcionando

3. **Se ainda crashar**:
   - Copie os logs do Render
   - Verifique qual erro específico está aparecendo

---

## 💡 Dica

Se o problema persistir, tente:
1. **Deletar o serviço** no Render
2. **Criar novamente** do zero
3. **Copiar os logs** e me enviar para análise

