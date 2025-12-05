# ⚡ Teste Rápido - Wedding Website

Teste estes endpoints para verificar se está funcionando:

---

## 🔗 URLs para Testar

### 1. API Root (deve retornar JSON)
```
https://weddingwebsite-1.onrender.com/api/home
```

**Esperado:** JSON com dados do home

### 2. Site Root (deve mostrar o site)
```
https://weddingwebsite-1.onrender.com/
```

**Esperado:** Página HTML do site de casamento

### 3. API Docs (Swagger)
```
https://weddingwebsite-1.onrender.com/docs
```

**Esperado:** Interface Swagger com todas as rotas

### 4. Admin Login
```
https://weddingwebsite-1.onrender.com/admin/login
```

**Esperado:** Página de login do admin

---

## ✅ O que Cada Teste Significa

| Teste | Funciona? | Significa |
|-------|-----------|-----------|
| `/api/home` | ✅ | Backend rodando, banco conectado |
| `/` | ✅ | Frontend buildado e servido |
| `/docs` | ✅ | FastAPI rodando corretamente |
| `/admin/login` | ✅ | Frontend React funcionando |

---

## 🐛 Se Algo Não Funcionar

### `/api/home` não funciona:
- ❌ Backend com problema
- Veja logs do Render
- Verifique DATABASE_URL

### `/` não funciona mas `/api/home` funciona:
- ❌ Frontend não buildado
- Veja logs do build
- Verifique se `npm run build` rodou

### Nada funciona:
- ❌ Serviço crashando
- Veja logs completos
- Pode ser erro de import ou configuração

---

## 📸 O que Me Enviar

Se ainda não funcionar, me envie:

1. **Screenshot dos logs** do Render
2. **O que aparece** quando acessa cada URL acima
3. **Resultado do build** (Events → último build)

Com isso consigo identificar o problema exato!

