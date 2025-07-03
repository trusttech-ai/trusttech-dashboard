#!/bin/bash

# Switch Configuration Script
# Use este script para alternar entre configurações Docker e Vercel

case "$1" in
"vercel")
    echo "🌐 Configurando para Vercel (serverless)..."
    
    # Backup current config if it's docker config
    if grep -q "standalone" next.config.ts; then
        cp next.config.ts next.config.backup.ts
        echo "📋 Backup da configuração atual salvo em next.config.backup.ts"
    fi
    
    # Use the main config (already configured for Vercel)
    echo "✅ Configuração para Vercel ativa"
    echo "📋 Para deploy: ./deploy-vercel.sh"
    ;;
    
"docker")
    echo "🐳 Configurando para Docker (standalone)..."
    
    # Backup current config
    cp next.config.ts next.config.backup.ts
    echo "📋 Backup da configuração atual salvo em next.config.backup.ts"
    
    # Use docker config
    cp next.config.docker.ts next.config.ts
    echo "✅ Configuração para Docker ativa"
    echo "📋 Para deploy: ./deploy.sh"
    ;;
    
"status")
    echo "📊 Status da configuração atual:"
    if grep -q "standalone" next.config.ts; then
        echo "🐳 Configurado para: Docker (standalone)"
        echo "📋 Deploy com: ./deploy.sh"
    else
        echo "🌐 Configurado para: Vercel (serverless)"
        echo "📋 Deploy com: ./deploy-vercel.sh"
    fi
    ;;
    
"restore")
    if [ -f "next.config.backup.ts" ]; then
        cp next.config.backup.ts next.config.ts
        echo "✅ Configuração restaurada do backup"
    else
        echo "❌ Arquivo de backup não encontrado"
    fi
    ;;
    
*)
    echo "Usage: $0 {vercel|docker|status|restore}"
    echo ""
    echo "  vercel   - Configurar para deploy na Vercel"
    echo "  docker   - Configurar para deploy no Docker"
    echo "  status   - Ver configuração atual"
    echo "  restore  - Restaurar backup da configuração"
    echo ""
    echo "Configuração atual:"
    if grep -q "standalone" next.config.ts; then
        echo "🐳 Docker (standalone)"
    else
        echo "🌐 Vercel (serverless)"
    fi
    exit 1
    ;;
esac
