import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";

import {
  uploadToGCS,
  initResumableUpload,
  uploadChunk,
  finalizeResumableUpload,
} from "@/lib/gcsUploader";

// Lista de extensões bloqueadas por representarem riscos de segurança
const BLOCKED_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".sh",
  ".vbs",
  ".ps1",
  ".psm1",
  ".psd1",
  ".msh",
  ".jar",
  ".jnlp",
  ".scr",
  ".dll",
  ".reg",
  ".htaccess",
  ".php",
  ".phtml",
  ".asp",
  ".aspx",
  ".cgi",
  ".pl",
  ".js",
];

// Configurações de upload
const MAX_FILE_SIZE = 25 * 1024 * 1024 * 1024; // 25GB
const CHUNK_SIZE_THRESHOLD = 10 * 1024 * 1024; // 10MB
const UPLOAD_TIMEOUT = 30 * 60 * 1000; // 30 minutos

// Mapa para armazenar streams de upload resumáveis em andamento
const uploadsInProgress = new Map<
  string,
  {
    stream: NodeJS.WritableStream;
    originalName: string;
    filename: string;
    extension: string;
    totalSize: number;
    uploadedSize: number;
    lastChunk: number;
    mimetype: string;
    createdAt: number;
  }
>();

// Função para limpar uploads expirados
function cleanExpiredUploads() {
  const now = Date.now();
  for (const [fileId, uploadInfo] of uploadsInProgress.entries()) {
    if (now - uploadInfo.lastChunk > UPLOAD_TIMEOUT) {
      uploadsInProgress.delete(fileId);
      console.log(`Upload expirado removido: ${fileId}`);
    }
  }
}

// Função para determinar o mimetype baseado na extensão
function getMimetype(filename: string): string {
  const ext = extname(filename).toLowerCase();
  const mimetypes: { [key: string]: string } = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
    ".csv": "text/csv",
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed",
  };

  return mimetypes[ext] || "application/octet-stream";
}

export async function POST(req: NextRequest) {
  try {
    // Limpar uploads expirados
    cleanExpiredUploads();

    const contentRange = req.headers.get("content-range");
    const originalFilename = req.headers.get("x-file-name");
    const fileId = req.headers.get("x-file-id") || uuidv4();
    const totalSizeHeader = req.headers.get("x-file-size");

    if (!originalFilename) {
      return NextResponse.json(
        { error: "Nome do arquivo não especificado" },
        { status: 400 }
      );
    }

    const fileExtension = extname(originalFilename).toLowerCase();

    // Verificar se a extensão é permitida
    if (BLOCKED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { error: `Tipo de arquivo não permitido: ${fileExtension}` },
        { status: 400 }
      );
    }

    // Verificar tamanho máximo do arquivo
    const totalSize = totalSizeHeader ? parseInt(totalSizeHeader, 10) : 0;
    if (totalSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Arquivo muito grande. Tamanho máximo: ${
            MAX_FILE_SIZE / (1024 * 1024 * 1024)
          }GB`,
        },
        { status: 413 }
      );
    }

    // Upload por chunks (Content-Range presente)
    if (contentRange) {
      const rangeMatch = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/);
      if (!rangeMatch) {
        return NextResponse.json(
          { error: "Header Content-Range inválido" },
          { status: 400 }
        );
      }

      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      const total = parseInt(rangeMatch[3], 10);
      const chunkSize = end - start + 1;

      // Validar tamanho do chunk
      if (chunkSize > 5 * 1024 * 1024) {
        // 5MB max por chunk
        return NextResponse.json(
          { error: "Chunk muito grande. Máximo 5MB por chunk" },
          { status: 400 }
        );
      }

      // Ler o chunk do body
      const buffer = Buffer.from(await req.arrayBuffer());

      // Verificar se o tamanho do buffer corresponde ao esperado
      if (buffer.length !== chunkSize) {
        return NextResponse.json(
          { error: "Tamanho do chunk não corresponde ao esperado" },
          { status: 400 }
        );
      }

      // Primeiro chunk - inicializar upload resumável no GCS
      if (start === 0) {
        // Gerar nome único para o arquivo no GCS
        // Remover a geração de timestamp e pasta de data
        const mimetype = getMimetype(originalFilename);
        const storagePath =
          req.headers.get("x-storage-path") || "users-profiles-pictures/images";

        try {
          // Inicializar upload resumável no GCS
          const { stream, filename: fullPath } = await initResumableUpload(
            storagePath || "users-profiles-pictures/images", // Usa o caminho fornecido
            originalFilename,
            mimetype,
            total
          );

          // Upload do primeiro chunk
          await uploadChunk(stream, buffer);

          // Registrar o upload em andamento
          uploadsInProgress.set(fileId, {
            stream,
            originalName: originalFilename,
            filename: fullPath,
            extension: fileExtension,
            totalSize: total,
            uploadedSize: buffer.length,
            lastChunk: Date.now(),
            mimetype,
            createdAt: Date.now(),
          });

          console.log(`Upload iniciado: ${fileId} - ${originalFilename}`);
        } catch (error) {
          console.error("Erro ao inicializar upload no GCS:", error);
          return NextResponse.json(
            { error: "Erro ao inicializar upload" },
            { status: 500 }
          );
        }
      } else {
        // Chunks subsequentes - enviar diretamente para o GCS
        const uploadInfo = uploadsInProgress.get(fileId);
        if (!uploadInfo) {
          return NextResponse.json(
            { error: "Upload não encontrado. Reinicie o processo." },
            { status: 400 }
          );
        }

        // Verificar se o chunk está na sequência correta
        if (start !== uploadInfo.uploadedSize) {
          return NextResponse.json(
            {
              error: "Chunk fora de sequência",
              expected: uploadInfo.uploadedSize,
              received: start,
            },
            { status: 400 }
          );
        }

        try {
          // Upload do chunk para o GCS
          await uploadChunk(uploadInfo.stream, buffer);

          // Atualizar o progresso
          uploadInfo.uploadedSize += buffer.length;
          uploadInfo.lastChunk = Date.now();
        } catch (error) {
          console.error("Erro ao fazer upload do chunk:", error);
          uploadsInProgress.delete(fileId);
          return NextResponse.json(
            { error: "Erro ao fazer upload do chunk" },
            { status: 500 }
          );
        }
      }

      // Verificar se é o último chunk
      const uploadInfo = uploadsInProgress.get(fileId);
      if (uploadInfo && uploadInfo.uploadedSize >= uploadInfo.totalSize) {
        try {
          const gcsUrl = await finalizeResumableUpload(
            uploadInfo.stream,
            uploadInfo.filename
          );

          // Limpar o registro do upload em andamento
          uploadsInProgress.delete(fileId);

          // Retornar informações sobre o arquivo completo
          return NextResponse.json({
            success: true,
            url: gcsUrl,
            fileName: uploadInfo.filename,
            originalName: originalFilename,
            size: uploadInfo.totalSize,
            fileId: fileId,
            complete: true,
          });
        } catch (error) {
          console.error("Erro ao finalizar upload no GCS:", error);
          uploadsInProgress.delete(fileId);
          return NextResponse.json(
            { error: "Erro ao finalizar upload" },
            { status: 500 }
          );
        }
      }

      // Retornar status do progresso
      return NextResponse.json({
        success: true,
        fileId: fileId,
        received: uploadInfo?.uploadedSize || 0,
        total: uploadInfo?.totalSize || 0,
        progress: Math.round(
          ((uploadInfo?.uploadedSize || 0) / (uploadInfo?.totalSize || 1)) * 100
        ),
        complete: false,
      });
    }
    // Upload simples (arquivo pequeno)
    else {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: "Nenhum arquivo foi enviado" },
          { status: 400 }
        );
      }

      // Verificar tamanho máximo
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `Arquivo muito grande. Tamanho máximo: ${
              MAX_FILE_SIZE / (1024 * 1024 * 1024)
            }GB`,
          },
          { status: 413 }
        );
      }

      // Para arquivos pequenos (< 10MB), fazer upload direto para GCS
      if (file.size <= CHUNK_SIZE_THRESHOLD) {
        try {
          // Converter para buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Gerar nome único para o arquivo no GCS
          const uniqueFilename = `${uuidv4()}${extname(file.name)}`;
          const mimetype = getMimetype(file.name);

          // Fazer upload para Google Cloud Storage
          const storagePath =
            req.headers.get("x-storage-path") ||
            "users-profiles-pictures/images";

          const gcsUrl = await uploadToGCS(
            buffer,
            storagePath,
            uniqueFilename,
            mimetype
          );

          console.log(gcsUrl);

          console.log(
            `Upload direto finalizado: ${file.name} - ${file.size} bytes`
          );

          return NextResponse.json({
            success: true,
            url: gcsUrl,
            fileName: uniqueFilename,
            originalName: file.name,
            size: file.size,
            type: mimetype,
          });
        } catch (error) {
          console.error("Erro ao fazer upload para GCS:", error);
          return NextResponse.json(
            { error: "Erro ao fazer upload do arquivo" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: `Arquivos maiores que ${
              CHUNK_SIZE_THRESHOLD / (1024 * 1024)
            }MB devem ser enviados em chunks`,
            shouldUseChunks: true,
            recommendedChunkSize: 5 * 1024 * 1024, // 5MB
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Erro no upload de arquivo:", error);
    return NextResponse.json(
      { error: "Erro ao processar upload" },
      { status: 500 }
    );
  }
}

// Método GET para verificar status de upload
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "fileId é obrigatório" },
        { status: 400 }
      );
    }

    const uploadInfo = uploadsInProgress.get(fileId);

    if (!uploadInfo) {
      return NextResponse.json(
        { error: "Upload não encontrado" },
        { status: 404 }
      );
    }

    const progress = Math.round(
      (uploadInfo.uploadedSize / uploadInfo.totalSize) * 100
    );

    return NextResponse.json({
      fileId,
      originalName: uploadInfo.originalName,
      received: uploadInfo.uploadedSize,
      total: uploadInfo.totalSize,
      progress,
      complete: uploadInfo.uploadedSize >= uploadInfo.totalSize,
      lastActivity: new Date(uploadInfo.lastChunk).toISOString(),
    });
  } catch (error) {
    console.error("Erro ao verificar status de upload:", error);
    return NextResponse.json(
      { error: "Erro ao verificar status" },
      { status: 500 }
    );
  }
}

// Método DELETE para cancelar upload
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "fileId é obrigatório" },
        { status: 400 }
      );
    }

    const uploadInfo = uploadsInProgress.get(fileId);
    if (uploadInfo) {
      uploadsInProgress.delete(fileId);
      console.log(`Upload cancelado: ${fileId}`);
    }

    return NextResponse.json({
      success: true,
      message: "Upload cancelado",
    });
  } catch (error) {
    console.error("Erro ao cancelar upload:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar upload" },
      { status: 500 }
    );
  }
}
