# 🔍 Diagnóstico: Serviço "Running" mas não Funciona

Se o serviço aparece como "Running" mas não está funcionando, siga estes passos:

---

## 📋 Passo 1: Verificar os Logs

### Como Ver os Logs no Render:

1. **Clique no serviço** "WeddingWebsite-1"
2. Vá na aba **"Logs"** (no menu lateral ou no topo)
3. **Role para baixo** para ver os logs mais recentes
4. Procure por erros em **vermelho** ou mensagens de erro

### O que Procurar nos Logs:

✅ **Bom sinal:**
```
Starting Wedding Website Application
Database tables created successfully
FastAPI app created
Serving frontend from: /opt/render/project/src/backend/frontend_dist
Startup completed
```

❌ **Problemas comuns:**
- `ModuleNotFoundError` → Dependência faltando
- `Database connection failed` → DATABASE_URL errada
- `Frontend not found` → Build do frontend falhou
- `Port already in use` → Problema de porta

---

## 📋 Passo 2: Testar a URL

### Teste 1: API Root
Acesse: `https://weddingwebsite-1.onrender.com/`

**Deve retornar:**
- Se frontend existe: Página HTML do site
- Se frontend não existe: `{"message": "Wedding Website API", "status": "running"}`

### Teste 2: API Endpoint
Acesse: `https://weddingwebsite-1.onrender.com/api/home`

**Deve retornar:**
```json
{
  "id": 1,
  "hero_text": "John & Jane",
  ...
}
```

### Teste 3: Docs
Acesse: `https://weddingwebsite-1.onrender.com/docs`

**Deve mostrar:** Interface Swagger da API

---

## 📋 Passo 3: Verificar Build

### No Render:

1. Vá em **"Events"** (ao lado de Logs)
2. Veja o último **"Build"**
3. Verifique se:
   - ✅ Build completou com sucesso
   - ✅ Frontend foi buildado (`npm run build`)
   - ✅ Python dependencies instaladas
   - ✅ Migrations rodaram

### Se Build Falhou:

- Veja os erros no build
- Pode ser: Node não instalado, npm install falhou, etc.

---

## 📋 Passo 4: Verificar Variáveis de Ambiente

1. Vá em **"Environment"**
2. Verifique se todas estão configuradas:

```
✅ DATABASE_URL
✅ JWT_SECRET
✅ ADMIN_USERNAME
✅ ADMIN_PASSWORD
✅ CORS_ORIGINS
✅ ENVIRONMENT
```

---

## 🐛 Problemas Comuns

### Problema: "Running" mas página não carrega

**Possíveis causas:**
1. Frontend não foi buildado
2. Caminho do frontend errado
3. Erro silencioso no código

**Solução:**
- Veja os logs (agora com mais informações)
- Verifique se `frontend_dist` existe após o build
- Teste a API diretamente: `/api/home`

### Problema: Logs não aparecem

**Solução:**
1. Clique em **"Logs"** no menu lateral
2. Se não aparecer, tente **"Events"**
3. Ou clique no **ícone de refresh** nos logs
4. Os logs podem demorar alguns segundos para aparecer

### Problema: Serviço reinicia constantemente

**Solução:**
- Veja os logs para identificar o erro
- Geralmente é: erro no código, import faltando, ou banco não conecta

---

## 🔧 Teste Rápido

Execute estes testes na ordem:

1. **Teste API**: `https://weddingwebsite-1.onrender.com/api/home`
   - Se funcionar: Backend OK ✅
   - Se não: Veja logs do backend

2. **Teste Root**: `https://weddingwebsite-1.onrender.com/`
   - Se mostrar site: Tudo OK ✅
   - Se mostrar JSON: Frontend não buildado

3. **Teste Docs**: `https://weddingwebsite-1.onrender.com/docs`
   - Se mostrar Swagger: Backend rodando ✅

---

## 📝 Checklist de Diagnóstico

- [ ] Logs aparecem no Render
- [ ] Build completou com sucesso
- [ ] API responde em `/api/home`
- [ ] Frontend existe (teste `/`)
- [ ] Variáveis de ambiente configuradas
- [ ] Database URL está correta
- [ ] Porta está usando `$PORT`

---

## 🚀 Próximos Passos

1. **Faça commit das melhorias de log**:
   ```bash
   git add backend/app/main.py
   git commit -m "Add detailed logging for debugging"
   git push
   ```

2. **Aguarde o deploy** (2-3 minutos)

3. **Veja os logs novamente** - agora devem ter mais informações

4. **Me envie**:
   - Screenshot dos logs
   - O que aparece quando acessa a URL
   - Resultado dos testes acima

---

## 💡 Dica

Se os logs ainda não aparecem:
- Tente **"Manual Deploy"** → **"Clear build cache & deploy"**
- Isso força um rebuild completo
- Pode resolver problemas de cache

---

## 🎯 O que Esperar Agora

Com as melhorias de log, você deve ver:

```
==================================================
Starting Wedding Website Application
==================================================
Creating database tables...
Database tables created successfully
FastAPI app created
Checking for frontend build...
Checking path: /opt/render/project/src/backend/frontend_dist
Path exists: /opt/render/project/src/backend/frontend_dist
Found index.html at: /opt/render/project/src/backend/frontend_dist
Serving frontend from: /opt/render/project/src/backend/frontend_dist
Mounting assets from: /opt/render/project/src/backend/frontend_dist/assets
==================================================
Startup event triggered
==================================================
Initializing admin user...
Admin user created successfully
==================================================
Startup completed
==================================================
```

Se aparecer algo diferente, me envie para análise!

