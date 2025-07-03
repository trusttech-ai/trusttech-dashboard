"use client";
import React, { useState, useEffect } from 'react';

import Sidebar from '../organisms/Sidebar';
import MobileHeader from '../molecules/MobileHeader';
import PageHeader from '../organisms/PageHeader';
import CommentModal from '../molecules/CommentModal';
import { useAuth } from '@/context/AuthContext';

interface ApprovalFile {
  id: string;
  logId: string;
  fileName: string;
  filePath: string;
  action: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  url: string;
}

const ApprovalPage: React.FC = () => {
  const { user } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [files, setFiles] = useState<ApprovalFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<'APPROVE' | 'REJECTED'>('APPROVE');
  const [selectedFile, setSelectedFile] = useState<ApprovalFile | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/approval?action=PENDING');
      const data = await response.json();
      
      setFiles(data.approvalActions || []);
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

const handleFileAction = async (file: ApprovalFile, action: 'APPROVE' | 'REJECTED', comment: string = '') => {
  try {
    setProcessingFile(file.fileName);
    const response = await fetch('/api/approval', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: file.id,
        action,
        fileName: file.fileName,
        comment,
        userId: user?.id
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      setFiles(prev => prev.filter(f => f.id !== file.id));
    } else {
      setError(data.error || 'Erro ao processar arquivo');
    }
  } catch (err) {
    setError('Erro ao processar arquivo');
    console.error('Error processing file:', err);
  } finally {
    setProcessingFile(null);
  }
};

  const handleDirectAction = async (file: ApprovalFile, action: 'APPROVE' | 'REJECTED') => {
    if (action === 'REJECTED') {
      openActionModal(file, action);
    } else {
      await handleFileAction(file, action);
    }
  };

  const openActionModal = (file: ApprovalFile, action: 'APPROVE' | 'REJECTED') => {
    setSelectedFile(file);
    setCurrentAction(action);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedFile(null);
  };

  const handleActionWithComment = async (comment: string) => {
    if (!selectedFile) return;
    
    try {
      setProcessingFile(selectedFile.fileName);
      setModalOpen(false);
      
      await handleFileAction(selectedFile, currentAction, comment);
      
      setSelectedFile(null);
    } catch (err) {
      setError('Erro ao processar arquivo');
      console.error('Error processing file:', err);
    } finally {
      setProcessingFile(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (type: string) => {
    const imageExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'avif', 'tiff', 'ico', 'jfif', 'pjpeg', 'pjp'
    ];

    const isImage = (val: string) =>
      !!val &&
      (
        val.startsWith('image/') ||
        imageExtensions.some(ext =>
          val.toLowerCase().includes(ext)
        )
      );

    if (type.includes("pdf")) {
      return (
        <svg
          className="h-8 w-8 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (isImage(type)) {
      return (
        <svg
          className="h-8 w-8 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (
      type.includes("text") ||
      type.includes("document") ||
      type.includes("word") ||
      type.includes("excel")
    ) {
      return (
        <svg
          className="h-8 w-8 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="h-8 w-8 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white transition-colors duration-200">
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      <div className="flex-1 flex flex-col relative overflow-y-auto pt-16 md:pt-0 transition-all duration-300 ease-in-out">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl"></div>
          <div className="absolute left-1/4 bottom-1/4 w-80 h-80 rounded-full bg-purple-800/10 blur-3xl"></div>
          <div className="absolute right-1/3 top-1/2 w-40 h-40 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>
        
        <div className="fixed top-0 left-0 right-0 z-30 md:hidden bg-gray-900 shadow-lg">
          <MobileHeader 
            title="Trusttech" 
            onMenuToggle={toggleMobileMenu} 
          />
        </div>
        
        <main className="flex-1 relative z-10">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
              <PageHeader title="Fluxo de Aprovação" />
              <button
                onClick={fetchFiles}
                className="inline-flex items-center px-4 py-2 border border-purple-600 rounded-md shadow-sm text-sm font-medium text-purple-400 bg-transparent hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </button>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              {error && (
                <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-400">Erro</h3>
                      <p className="text-sm text-red-300 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-lg">
                <div className="px-6 py-4 border-b border-gray-700/50">
                  <div className="flex items-center">
                    <div className="h-6 w-1 bg-purple-600 rounded-full mr-3"></div>
                    <h2 className="text-xl font-semibold text-white">
                      Arquivos Pendentes de Aprovação
                    </h2>
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {files?.length} {files?.length === 1 ? 'arquivo' : 'arquivos'}
                    </span>
                  </div>
                </div>

                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center">
                      <svg className="animate-spin h-5 w-5 text-purple-500 mr-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-300">Carregando arquivos...</span>
                    </div>
                  </div>
                ) : files?.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      Nenhum arquivo pendente
                    </h3>
                    <p className="text-gray-400">
                      Não há arquivos aguardando aprovação no momento.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700/50">
                    {files?.map((file) => (
                      <div key={file.fileName} className="p-6 hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {getFileIcon(file.fileName.split('.').pop() || '')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-medium text-white truncate">
                                {file.fileName}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                                <span>Criado: {formatDate(file.createdAt)}</span>
                                <span>•</span>
                                <span>Atualizado: {formatDate(file.updatedAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Visualizar
                            </a>
                            
                            <button
                              onClick={() => handleDirectAction(file, 'REJECTED')}
                              disabled={processingFile === file.fileName}
                              className="inline-flex items-center px-3 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-400 bg-transparent hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingFile === file.fileName ? (
                                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              Rejeitar
                            </button>
                            
                            <button
                              onClick={() => handleDirectAction(file, 'APPROVE')}
                              disabled={processingFile === file.fileName}
                              className="inline-flex items-center px-3 py-2 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-400 bg-transparent hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingFile === file.fileName ? (
                                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              Aprovar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <CommentModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleActionWithComment}
        title={`${currentAction === 'APPROVE' ? 'Aprovar' : 'Rejeitar'} arquivo`}
        actionType={currentAction}
      />
    </div>
  );
};

export default ApprovalPage;
