"use client";
import React, { useState, useCallback, useEffect } from "react";
import path from "path";

import Sidebar from "../components/organisms/Sidebar";
import MobileHeader from "../components/molecules/MobileHeader";
import PageHeader from "../components/organisms/PageHeader";
import { useAuth } from "@/context/AuthContext";

interface UploadedFile {
  originalName: string;
  fileName: string;
  size: number;
  type: string;
  category: string;
  description: string;
  url: string;
  uploadedAt: string;
}

interface ApprovalAction {
  id: string;
  fileName: string;
  filePath: string;
  action: string;
  comment: string;
  createdAt: string;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024 * 1024; // 25GB
const CHUNK_SIZE = 5 * 1024 * 1024;

const UploadDocumentsPage: React.FC = () => {
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalAction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const categories = [
    { value: "contrato", label: "Contratos" },
    { value: "relatorio", label: "Relatórios" },
    { value: "configuracao", label: "Configurações" },
    { value: "documento", label: "Documentos Gerais" },
    { value: "planilha", label: "Planilhas" },
    { value: "imagem", label: "Imagens" },
    { value: "outros", label: "Outros" },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    setError(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    setError(null);
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
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
    } else if (type.includes("image")) {
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

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Selecione pelo menos um arquivo para enviar");
      return;
    }

    if (!category) {
      setError("Selecione uma categoria para os arquivos");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress({});

    const uploadPath = "approvals/lunna/approval-pending";

    const uploadResults: UploadedFile[] = [];
    let hasError = false;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const progressKey = `${file.name}-${i}`;

      try {
        setUploadProgress((prev) => ({ ...prev, [progressKey]: 0 }));

        if (file.size > MAX_FILE_SIZE) {
          hasError = true;
          setError(
            `Arquivo ${file.name} excede o tamanho máximo de ${
              MAX_FILE_SIZE / (1024 * 1024 * 1024)
            }GB`
          );
          setUploadProgress((prev) => ({ ...prev, [progressKey]: -1 }));
          continue;
        }

        let response, data;

        // Para arquivos pequenos (< 10MB), fazer upload direto
        if (file.size <= CHUNK_SIZE * 2) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", category);
          formData.append("description", description);

          response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            headers: {
              "x-file-name": file.name,
              "x-storage-path": uploadPath,
            },
          });

          data = await response.json();

          // Correção para a chamada da API de log
          response = await fetch("/api/upload-log", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              filePath: `${uploadPath}/${file.name}`,
              uploadedBy: user?.id || "system",
            }),
          });


           await fetch('/api/approval', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  fileName: file.name,
                  action: 'PENDING',
                  comment: description ?? ''
                })
              });
        }
        // Para arquivos grandes, usar upload em chunks
        else {
          const fileId = crypto.randomUUID();
          const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

          for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE - 1, file.size - 1);
            const chunk = file.slice(start, end + 1);

            const formData = new FormData();
            formData.append("chunk", chunk);

            // Calcular progresso baseado nos chunks
            const chunkProgress = Math.round(
              ((chunkIndex + 1) / totalChunks) * 100
            );
            setUploadProgress((prev) => ({
              ...prev,
              [progressKey]: Math.min(chunkProgress, 99),
            }));

            response = await fetch("/api/upload", {
              method: "POST",
              body: chunk,
              headers: {
                "Content-Type": "application/octet-stream",
                "x-file-name": file.name,
                "x-file-id": fileId,
                "x-file-size": file.size.toString(),
                "x-storage-path": uploadPath, // Adiciona o caminho de armazenamento
                "Content-Range": `bytes ${start}-${end}/${file.size}`,
              },
            });

            data = await response.json();

            if (!data.success) {
              throw new Error(data.error || "Erro no upload do chunk");
            }

            if (data.complete) {
              await fetch("/api/upload-log", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  fileName: file.name,
                  fileType: file.type,
                  fileSize: file.size,
                  filePath: `${uploadPath}/${file.name}`,
                  uploadedBy: user?.id || "system",
                }),
              });

              await fetch('/api/approval', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  fileName: file.name,
                  action: 'PENDING',
                  comment: description ?? ''
                })
              });

              break;
            }
          }
        }

        if (data.success) {
          setUploadProgress((prev) => ({ ...prev, [progressKey]: 100 }));

          // Formatar dados do arquivo para o estado
          const uploadedFile: UploadedFile = {
            originalName: data.originalName,
            fileName: data.fileName,
            size: data.size,
            type: data.type || file.type,
            category: category,
            description: description,
            url: data.url,
            uploadedAt: new Date().toISOString(),
          };

          uploadResults.push(uploadedFile);
        } else {
          hasError = true;
          setError(data.error || "Erro no upload");
          setUploadProgress((prev) => ({ ...prev, [progressKey]: -1 }));
        }
      } catch (err) {
        hasError = true;
        console.error("Upload error:", err);
        setError("Erro de conexão durante o upload");
        setUploadProgress((prev) => ({ ...prev, [progressKey]: -1 }));
      }
    }

    setIsUploading(false);

    if (!hasError) {
      setUploadedFiles((prev) => [...prev, ...uploadResults]);
      setSelectedFiles([]);
      setCategory("");
      setDescription("");
      setSuccess(
        `${uploadResults.length} arquivo(s) enviado(s) com sucesso para aprovação!`
      );

      // Limpar progresso após 3 segundos
      setTimeout(() => {
        setUploadProgress({});
      }, 3000);
    }
  };

  const fetchApprovalHistory = async () => {
    try {
      setLoadingHistory(true);
      setHistoryError(null);

      const response = await fetch('/api/approval?filePath=approvals/lunna/approval-pending');
      const data = await response.json();

      if (data.success) {
        setApprovalHistory(data.approvalActions);
      } else {
        setHistoryError(
          data.error || "Erro ao carregar histórico de aprovações"
        );
      }
    } catch (err) {
      setHistoryError("Erro ao conectar com o servidor");
      console.error("Error fetching approval history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchApprovalHistory();
  }, [uploadedFiles]);

  const formatApprovalDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const clearError = () => {
    setError(null);
  };

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
          <MobileHeader title="Trusttech" onMenuToggle={toggleMobileMenu} />
        </div>

        <main className="flex-1 relative z-10">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <PageHeader title="Envio de Documentos" />

              <div className="mt-8 space-y-8">
                {/* Mensagens de sucesso e erro */}
                {success && (
                  <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <svg
                          className="h-5 w-5 text-green-400 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-green-400">
                            Sucesso
                          </h3>
                          <p className="text-sm text-green-300 mt-1">
                            {success}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={clearSuccess}
                        className="text-green-400 hover:text-green-300"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <svg
                          className="h-5 w-5 text-red-400 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-red-400">
                            Erro
                          </h3>
                          <p className="text-sm text-red-300 mt-1">{error}</p>
                        </div>
                      </div>
                      <button
                        onClick={clearError}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                {/* Área de upload */}
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-lg">
                  <div className="px-6 py-4 border-b border-gray-700/50">
                    <div className="flex items-center">
                      <div className="h-6 w-1 bg-purple-600 rounded-full mr-3"></div>
                      <h2 className="text-xl font-semibold text-white">
                        Enviar Documentos para Aprovação
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Área de drag and drop */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragOver
                          ? "border-purple-500 bg-purple-900/10"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">
                        Arraste arquivos aqui ou clique para selecionar
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Todos os tipos de arquivo são aceitos
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Tamanho máximo: 25GB por arquivo
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        // Remover a restrição de tipos de arquivo
                        // accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx,.xls,.xlsx,.json,.csv"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 border border-purple-600 rounded-md shadow-sm text-sm font-medium text-purple-400 bg-transparent hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors cursor-pointer"
                      >
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Selecionar Arquivos
                      </label>
                    </div>

                    {/* Formulário de metadados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Categoria *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-gray-700/50 text-white border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          required
                        >
                          <option value="">Selecione uma categoria</option>
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Descrição (opcional)
                        </label>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Descrição dos documentos..."
                          className="w-full bg-gray-700/50 text-white border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Lista de arquivos selecionados */}
                    {selectedFiles.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-300 mb-4">
                          Arquivos Selecionados ({selectedFiles.length})
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {selectedFiles.map((file, index) => {
                            const progressKey = `${file.name}-${index}`;
                            const progress = uploadProgress[progressKey];

                            return (
                              <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    {getFileIcon(file.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatFileSize(file.size)}
                                    </p>
                                    {progress !== undefined && (
                                      <div className="mt-1">
                                        <div className="flex items-center space-x-2">
                                          <div className="flex-1 bg-gray-600 rounded-full h-1">
                                            <div
                                              className={`h-1 rounded-full transition-all duration-300 ${
                                                progress === -1
                                                  ? "bg-red-500"
                                                  : progress === 100
                                                  ? "bg-green-500"
                                                  : "bg-purple-500"
                                              }`}
                                              style={{
                                                width: `${Math.max(
                                                  0,
                                                  progress
                                                )}%`,
                                              }}
                                            />
                                          </div>
                                          <span className="text-xs text-gray-400">
                                            {progress === -1
                                              ? "Erro"
                                              : `${progress}%`}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {!isUploading && (
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="text-gray-400 hover:text-red-400 transition-colors"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Botão de upload */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          handleUpload();
                          console.log("Botão de upload clicado");
                        }}
                        disabled={
                          isUploading || selectedFiles.length === 0 || !category
                        }
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {isUploading ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <svg
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            Enviar para Aprovação
                          </>
                        )}
                      </button>
                    </div>
                  </div>{" "}
                  {/* Closing the missing div for "p-6 space-y-6" */}
                </div>{" "}
                {/* Closing div for "bg-gray-800/50 backdrop-blur-lg" */}
                {/* Lista de arquivos enviados recentemente */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-700/50">
                      <div className="flex items-center">
                        <div className="h-6 w-1 bg-green-600 rounded-full mr-3"></div>
                        <h2 className="text-xl font-semibold text-white">
                          Arquivos Enviados Recentemente
                        </h2>
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {uploadedFiles.length}{" "}
                          {uploadedFiles.length === 1 ? "arquivo" : "arquivos"}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-700/50">
                      {uploadedFiles
                        .slice(-5)
                        .reverse()
                        .map((file, index) => {
                          // Find if this file has an approval action
                          const approvalAction = approvalHistory.find(
                            (action) =>
                              action.fileName === file.fileName ||
                              action.fileName === path.basename(file.fileName)
                          );

                          return (
                            <div
                              key={index}
                              className="p-4 hover:bg-gray-700/20 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    {getFileIcon(file.type)}
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-white">
                                      {file.originalName}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                                      <span>{formatFileSize(file.size)}</span>
                                      <span>•</span>
                                      <span className="capitalize">
                                        {file.category}
                                      </span>
                                      <span>•</span>
                                      <span>
                                        {new Date(
                                          file.uploadedAt
                                        ).toLocaleString("pt-BR")}
                                      </span>
                                    </div>
                                    {file.description && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {file.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {approvalAction ? (
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        approvalAction.action === "APPROVE"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {approvalAction.action === "APPROVE"
                                        ? "Aprovado"
                                        : "Rejeitado"}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      Aguardando Aprovação
                                    </span>
                                  )}
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </a>
                                </div>
                              </div>

                              {/* Show rejection comment if available */}
                              {approvalAction &&
                                approvalAction.action === "REJECTED" &&
                                approvalAction.comment && (
                                  <div className="mt-2 bg-red-900/10 p-2 rounded border border-red-500/30">
                                    <p className="text-xs text-red-300">
                                      <span className="font-medium">
                                        Motivo da rejeição:{" "}
                                      </span>
                                      {approvalAction.comment}
                                    </p>
                                  </div>
                                )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                {/* Histórico de Aprovações */}
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-lg mt-8">
                  <div className="px-6 py-4 border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-6 w-1 bg-blue-600 rounded-full mr-3"></div>
                        <h2 className="text-xl font-semibold text-white">
                          Histórico de Aprovações
                        </h2>
                      </div>
                      <button
                        onClick={fetchApprovalHistory}
                        className="inline-flex items-center px-3 py-1 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Atualizar
                      </button>
                    </div>
                  </div>

                  <div>
                    {loadingHistory ? (
                      <div className="p-6 text-center">
                        <div className="inline-flex items-center">
                          <svg
                            className="animate-spin h-5 w-5 text-purple-500 mr-3"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span className="text-gray-300">
                            Carregando histórico...
                          </span>
                        </div>
                      </div>
                    ) : historyError ? (
                      <div className="p-6 text-center">
                        <p className="text-red-400">{historyError}</p>
                      </div>
                    ) : approvalHistory.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-gray-400">
                          Nenhum histórico de aprovação disponível.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-700/50">
                        {approvalHistory.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 hover:bg-gray-700/20 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h3 className="text-sm font-medium text-white">
                                    {item.fileName}
                                  </h3>
                                  <span
                                    className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      item.action === "APPROVE"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {item.action === "APPROVE"
                                      ? "Aprovado"
                                      : "Rejeitado"}
                                  </span>
                                </div>

                                <p className="text-xs text-gray-400 mt-1">
                                  {formatApprovalDate(item.createdAt)}
                                </p>

                                {item.comment && (
                                  <div className="mt-2 bg-gray-700/30 p-2 rounded border border-gray-600/50">
                                    <p className="text-xs text-gray-300">
                                      <span className="font-medium">
                                        Comentário:{" "}
                                      </span>
                                      {item.comment}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadDocumentsPage;
