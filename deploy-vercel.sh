#!/bin/bash

# Vercel Deploy Script for Trusttech Dashboard

echo "🚀 Preparando deploy para Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

echo "📋 Checklist pré-deploy:"

# Check if all required files exist
files_to_check=("next.config.ts" "vercel.json" "package.json" "prisma/schema.prisma")
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file encontrado"
    else
        echo "❌ $file não encontrado"
        exit 1
    fi
done

# Test build locally
echo "🔨 Testando build local..."
npm run build:vercel

if [ $? -eq 0 ]; then
    echo "✅ Build local bem-sucedido"
else
    echo "❌ Build local falhou. Corrija os erros antes de continuar."
    exit 1
fi

echo "🌐 Verificando variáveis de ambiente necessárias..."
echo "   As seguintes variáveis devem estar configuradas no dashboard da Vercel:"
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL"
echo "   - JWT_SECRET"
echo "   - NODE_ENV=production"

read -p "✅ Variáveis de ambiente configuradas na Vercel? (y/n): " env_confirmed
if [ "$env_confirmed" != "y" ]; then
    echo "⚠️  Configure as variáveis de ambiente primeiro em: https://vercel.com/dashboard"
    exit 1
fi

echo "🚀 Iniciando deploy..."

# Check if this is the first deployment
if [ ! -f ".vercel/project.json" ]; then
    echo "🆕 Primeiro deploy detectado"
    vercel --prod
else
    echo "📦 Deploy de atualização"
    vercel --prod
fi

echo "✅ Deploy concluído!"
echo "🔗 Verifique seu app em: https://your-app.vercel.app"
echo "🏥 Health check: https://your-app.vercel.app/api/health"

# Optional: Open the deployed app
read -p "🌐 Abrir o app no navegador? (y/n): " open_app
if [ "$open_app" = "y" ]; then
    if command -v vercel &> /dev/null; then
        vercel --prod --open
    fi
fi
