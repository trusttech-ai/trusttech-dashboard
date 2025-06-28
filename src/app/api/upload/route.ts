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
  }
>();

export async function POST(req: NextRequest) {
  try {
    const contentRange = req.headers.get("content-range");
    const originalFilename = req.headers.get("x-file-name");
    const fileId = req.headers.get("x-file-id") || uuidv4();

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

      // Ler o chunk do body
      const buffer = Buffer.from(await req.arrayBuffer());

      // Primeiro chunk - inicializar upload resumável no GCS
      if (start === 0) {
        // Gerar nome único para o arquivo no GCS
        const timestamp = new Date()
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "");
        const uniqueFilename = `${timestamp}/${fileId}${fileExtension}`;

        // Determinar mimetype
        const mimetype = originalFilename.includes(".")
          ? `image/${fileExtension.slice(1)}`
          : "application/octet-stream";

        try {
          // Inicializar upload resumável no GCS
          const { stream, filename: fullPath } = await initResumableUpload(
            "users-profiles-pictures/images",
            uniqueFilename,
            mimetype,
            total
          );

          // Upload do primeiro chunk
          await uploadChunk(stream, buffer);

          // Registrar o upload em andamento
          uploadsInProgress.set(fileId, {
            stream,
            originalName: originalFilename,
            filename: fullPath, // Usar o path completo retornado
            extension: fileExtension,
            totalSize: total,
            uploadedSize: buffer.length,
            lastChunk: Date.now(),
            mimetype,
          });
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
      if (uploadInfo && end + 1 >= uploadInfo.totalSize) {
        try {
          // Finalizar upload no GCS
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

      // Para arquivos pequenos (< 10MB), fazer upload direto para GCS
      if (file.size <= 10 * 1024 * 1024) {
        try {
          // Converter para buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Gerar nome único para o arquivo no GCS
          const timestamp = new Date()
            .toISOString()
            .split("T")[0]
            .replace(/-/g, "");
          const uniqueFilename = `${timestamp}/${uuidv4()}${extname(
            file.name
          )}`;

          // Fazer upload para Google Cloud Storage
          const gcsUrl = await uploadToGCS(
            buffer,
            "users-profiles-pictures/images",
            uniqueFilename,
            file.type || "application/octet-stream"
          );

          return NextResponse.json({
            success: true,
            url: gcsUrl,
            fileName: uniqueFilename,
            originalName: file.name,
            size: file.size,
            type: file.type,
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
          { error: "Arquivos maiores que 10MB devem ser enviados em chunks" },
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

    return NextResponse.json({
      fileId,
      originalName: uploadInfo.originalName,
      received: uploadInfo.uploadedSize,
      total: uploadInfo.totalSize,
      complete: uploadInfo.uploadedSize >= uploadInfo.totalSize,
    });
  } catch (error) {
    console.error("Erro ao verificar status de upload:", error);
    return NextResponse.json(
      { error: "Erro ao verificar status" },
      { status: 500 }
    );
  }
}
