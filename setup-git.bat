@echo off
echo ========================================
echo Configurando Git para Wedding Website
echo ========================================
echo.

REM Verificar se git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Git nao esta instalado!
    echo Por favor, instale o Git de https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] Inicializando repositorio Git...
if exist .git (
    echo Repositorio Git ja existe. Continuando...
) else (
    git init
    echo Repositorio Git inicializado!
)

echo.
echo [2/5] Adicionando remote do GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/MackKirk/WeddingWebsite.git
echo Remote configurado!

echo.
echo [3/5] Adicionando todos os arquivos...
git add .
echo Arquivos adicionados!

echo.
echo [4/5] Fazendo commit inicial...
git commit -m "Initial commit - Wedding Website Full Stack

- Backend FastAPI com SQLAlchemy
- Frontend React + Vite + TailwindCSS
- Admin panel completo
- Sistema de autenticacao JWT
- Upload de imagens
- Design premium com animacoes suaves
- Responsivo e otimizado"

echo.
echo [5/5] Enviando para o GitHub...
echo.
echo IMPORTANTE: Se for a primeira vez, o GitHub pode pedir autenticacao.
echo Se pedir usuario/senha, use um Personal Access Token.
echo.
git branch -M main
git push -u origin main

echo.
echo ========================================
echo CONCLUIDO!
echo ========================================
echo.
echo Seu codigo foi enviado para:
echo https://github.com/MackKirk/WeddingWebsite
echo.
pause

