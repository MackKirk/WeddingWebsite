#!/bin/bash

echo "========================================"
echo "Configurando Git para Wedding Website"
echo "========================================"
echo ""

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo "ERRO: Git não está instalado!"
    echo "Por favor, instale o Git de https://git-scm.com/download"
    exit 1
fi

echo "[1/5] Inicializando repositório Git..."
if [ -d .git ]; then
    echo "Repositório Git já existe. Continuando..."
else
    git init
    echo "Repositório Git inicializado!"
fi

echo ""
echo "[2/5] Adicionando remote do GitHub..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/MackKirk/WeddingWebsite.git
echo "Remote configurado!"

echo ""
echo "[3/5] Adicionando todos os arquivos..."
git add .
echo "Arquivos adicionados!"

echo ""
echo "[4/5] Fazendo commit inicial..."
git commit -m "Initial commit - Wedding Website Full Stack

- Backend FastAPI com SQLAlchemy
- Frontend React + Vite + TailwindCSS
- Admin panel completo
- Sistema de autenticação JWT
- Upload de imagens
- Design premium com animações suaves
- Responsivo e otimizado"

echo ""
echo "[5/5] Enviando para o GitHub..."
echo ""
echo "IMPORTANTE: Se for a primeira vez, o GitHub pode pedir autenticação."
echo "Se pedir usuário/senha, use um Personal Access Token."
echo ""
git branch -M main
git push -u origin main

echo ""
echo "========================================"
echo "CONCLUÍDO!"
echo "========================================"
echo ""
echo "Seu código foi enviado para:"
echo "https://github.com/MackKirk/WeddingWebsite"
echo ""

