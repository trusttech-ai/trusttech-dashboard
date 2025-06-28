#!/bin/bash

# Script para executar testes do uploadFile com relatório detalhado

echo "🧪 Executando Testes do Sistema de Upload"
echo "========================================"
echo ""

# Executar testes com coverage
echo "📊 Executando testes com coverage..."
npx jest src/lib/__tests__/uploadFile.test.ts --coverage --verbose --passWithNoTests

echo ""
echo "✅ Testes concluídos!"
echo ""

# Mostrar estatísticas dos testes
echo "📈 Resumo dos Tamanhos Testados:"
echo "• 20MB   → 10 chunks   (Arquivo médio)"
echo "• 200MB  → 100 chunks  (Arquivo grande)"  
echo "• 900MB  → 450 chunks  (Arquivo muito grande)"
echo "• 1.5GB  → 768 chunks  (Arquivo gigante)"
echo "• 6GB    → 3072 chunks (Arquivo extremo)"
echo ""

echo "🔗 Para testar na interface:"
echo "1. Inicie o servidor: npm run dev"
echo "2. Acesse: http://localhost:3000/test-upload"
echo "3. Teste uploads reais com diferentes tamanhos"
echo ""

echo "💡 Para testes programáticos no browser:"
echo "Abra o console e execute: uploadTests.runAllTests()"
