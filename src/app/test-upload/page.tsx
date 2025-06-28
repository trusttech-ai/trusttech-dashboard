/**
 * Página de teste para demonstrar o funcionamento do hook uploadFile
 */

import UploadTester from '@/components/test/UploadTester';

export default function TestUploadPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Teste do Sistema de Upload
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Esta página permite testar o hook <code className="bg-gray-200 px-2 py-1 rounded">uploadFile</code> 
            que faz upload de arquivos para o Google Cloud Storage através de chunks.
          </p>
        </div>

        <UploadTester />

        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📚 Como funciona o sistema de upload
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                🔧 Funcionamento técnico
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Chunks:</strong> Arquivos grandes são divididos em pedaços de 2MB</li>
                <li>• <strong>Progresso:</strong> Callback em tempo real do progresso do upload</li>
                <li>• <strong>Retry:</strong> Recuperação automática em caso de erro</li>
                <li>• <strong>UUID:</strong> Cada upload recebe um ID único</li>
                <li>• <strong>Headers:</strong> Metadados enviados via HTTP headers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                🛡️ Segurança
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Validação:</strong> Tipos de arquivo são validados</li>
                <li>• <strong>Bloqueio:</strong> Extensões perigosas são bloqueadas</li>
                <li>• <strong>Tamanho:</strong> Limite de tamanho por arquivo</li>
                <li>• <strong>Temporário:</strong> Arquivos incompletos ficam em /temp</li>
                <li>• <strong>Limpeza:</strong> Uploads abandonados são removidos</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              💡 Dica para desenvolvedores
            </h4>
            <p className="text-sm text-blue-700">
              Você pode usar o console do navegador para executar testes programáticos. 
              Abra o DevTools e digite <code>uploadTests.runAllTests()</code> para executar 
              uma bateria completa de testes automatizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
