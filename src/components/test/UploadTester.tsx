/**
 * Componente de teste para a função uploadFile
 * Permite testar uploads de forma interativa na interface
 */

'use client';

import React, { useState, useRef } from 'react';
import { uploadFile } from '../../lib/uploadFile';

interface UploadResult {
  url?: string;
  error?: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
}

export default function UploadTester() {
  const [result, setResult] = useState<UploadResult>({
    progress: 0,
    status: 'idle'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResult({
      progress: 0,
      status: 'uploading'
    });

    try {
      const onProgress = (progress: number) => {
        setResult(prev => ({
          ...prev,
          progress
        }));
      };

      const url = await uploadFile(file, onProgress);

      setResult({
        url,
        progress: 100,
        status: 'success'
      });

    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        progress: 0,
        status: 'error'
      });
    }
  };

  const resetTest = () => {
    setResult({
      progress: 0,
      status: 'idle'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'uploading': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressBarColor = () => {
    switch (result.status) {
      case 'uploading': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🧪 Testador de Upload de Arquivos
      </h2>

      <div className="space-y-6">
        {/* Input de arquivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione um arquivo para testar o upload:
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            disabled={result.status === 'uploading'}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
        </div>

        {/* Barra de progresso */}
        {result.status !== 'idle' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={getStatusColor()}>
                {result.status === 'uploading' && '⬆️ Fazendo upload...'}
                {result.status === 'success' && '✅ Upload concluído!'}
                {result.status === 'error' && '❌ Erro no upload'}
              </span>
              <span className="text-gray-600">{result.progress}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                style={{ width: `${result.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Resultado */}
        {result.status === 'success' && result.url && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              ✅ Upload realizado com sucesso!
            </h3>
            <p className="text-sm text-green-700 break-all">
              <strong>URL:</strong> {result.url}
            </p>
            <button
              onClick={() => window.open(result.url, '_blank')}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
            >
              🔗 Abrir arquivo
            </button>
          </div>
        )}

        {result.status === 'error' && result.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              ❌ Erro no upload
            </h3>
            <p className="text-sm text-red-700">
              <strong>Erro:</strong> {result.error}
            </p>
          </div>
        )}

        {/* Botão de reset */}
        {result.status !== 'idle' && result.status !== 'uploading' && (
          <button
            onClick={resetTest}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            🔄 Fazer novo teste
          </button>
        )}

        {/* Informações sobre o teste */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-2">
            📋 Informações do teste:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Arquivos pequenos (&lt; 2MB) são enviados em um único chunk</li>
            <li>• Arquivos grandes são divididos em chunks de 2MB</li>
            <li>• O progresso é atualizado em tempo real</li>
            <li>• Tipos de arquivo bloqueados: .exe, .bat, .php, etc.</li>
            <li>• Arquivos são salvos em /uploads/ano/mês/</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
