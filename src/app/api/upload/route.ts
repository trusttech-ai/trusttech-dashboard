import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, appendFile, copyFile } from "fs/promises";
import { join, extname } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

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

// Tipos de arquivos permitidos para upload
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
];

// Verifica se um arquivo está em progresso de upload
const uploadsInProgress = new Map();

export async function POST(req: NextRequest) {
  try {
    // Obter parâmetros de chunk do cabeçalho
    const contentRange = req.headers.get("content-range");
    // const contentType = req.headers.get("content-type");
    const originalFilename = req.headers.get("x-file-name");
    // const totalSize = parseInt(req.headers.get("x-file-size") || "0", 10);
    const fileId = req.headers.get("x-file-id") || uuidv4();

    if (!originalFilename) {
      return NextResponse.json(
        { error: "Nome do arquivo não especificado" },
        { status: 400 }
      );
    }

    // Verificar extensão do arquivo
    const fileExtension = extname(originalFilename).toLowerCase();
    if (BLOCKED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        {
          error: `Arquivos com extensão ${fileExtension} não são permitidos por motivos de segurança`,
        },
        { status: 400 }
      );
    }

    // Configurar caminhos de diretórios
    const publicDir = join(process.cwd(), "public");
    const uploadsDir = join(publicDir, "uploads");
    const tempDir = join(uploadsDir, "temp");
    const yearDir = join(uploadsDir, new Date().getFullYear().toString());
    const monthDir = join(
      yearDir,
      (new Date().getMonth() + 1).toString().padStart(2, "0")
    );

    // Garantir que todos os diretórios existam
    for (const dir of [uploadsDir, tempDir, yearDir, monthDir]) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }

    // Processar upload em chunks
    if (contentRange) {
      // Formato do Content-Range: bytes start-end/total
      const [, rangeValue] = contentRange.split(" ");
      const [range, total] = rangeValue.split("/");
      const [start, end] = range.split("-").map(Number);

      // Arquivo temporário onde os chunks são salvos
      const tempFilePath = join(tempDir, fileId);

      // Ler o chunk atual
      const chunk = await req.arrayBuffer();
      const buffer = Buffer.from(chunk);

      // Salvar o chunk no arquivo temporário
      if (start === 0) {
        // Primeiro chunk - criar arquivo
        await writeFile(tempFilePath, buffer);

        // Registrar o upload em andamento
        uploadsInProgress.set(fileId, {
          originalName: originalFilename,
          extension: fileExtension,
          tempPath: tempFilePath,
          totalSize: parseInt(total, 10),
          uploadedSize: buffer.length,
          lastChunk: Date.now(),
        });
      } else {
        // Chunks subsequentes - anexar ao arquivo
        await appendFile(tempFilePath, buffer);

        // Atualizar o progresso
        const progress = uploadsInProgress.get(fileId);
        if (progress) {
          progress.uploadedSize += buffer.length;
          progress.lastChunk = Date.now();
        }
      }

      // Verificar se é o último chunk
      const uploadInfo = uploadsInProgress.get(fileId);
      if (uploadInfo && end + 1 >= uploadInfo.totalSize) {
        // Upload completo - mover para localização final
        const uniqueFilename = `${fileId}${fileExtension}`;
        const finalFilePath = join(monthDir, uniqueFilename);

        // Mover o arquivo temporário para o destino final - CORREÇÃO
        try {
          // Opção 1: Usando copyFile
          await copyFile(tempFilePath, finalFilePath);

          // OU Opção 2: Ler e escrever (para arquivos menores)
          // const fileContent = await readFile(tempFilePath);
          // await writeFile(finalFilePath, fileContent);
        } catch (error) {
          console.error("Erro ao mover arquivo:", error);
          return NextResponse.json(
            { error: "Erro ao finalizar o upload" },
            { status: 500 }
          );
        }

        // Limpar o registro do upload em andamento
        uploadsInProgress.delete(fileId);

        // Retornar informações sobre o arquivo completo
        const relativeFilePath = `/uploads/${new Date().getFullYear()}/${(
          new Date().getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${uniqueFilename}`;

        return NextResponse.json({
          success: true,
          url: relativeFilePath,
          fileName: uniqueFilename,
          originalName: originalFilename,
          size: uploadInfo.totalSize,
          fileId: fileId,
          complete: true,
        });
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

      // Para arquivos pequenos (< 10MB), usar o método anterior
      if (file.size <= 10 * 1024 * 1024) {
        // Gerar nome único
        const uniqueFilename = `${uuidv4()}${fileExtension}`;
        const filePath = join(monthDir, uniqueFilename);

        // Salvar arquivo
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Caminho relativo para URL
        const relativeFilePath = `/uploads/${new Date().getFullYear()}/${(
          new Date().getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${uniqueFilename}`;

        return NextResponse.json({
          success: true,
          url: relativeFilePath,
          fileName: uniqueFilename,
          originalName: file.name,
          size: file.size,
          type: file.type,
        });
      } else {
        // Para arquivos grandes, exigir upload em chunks
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

// Implementar endpoint para verificar status de upload
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fileId = url.searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json(
      { error: "ID do arquivo não fornecido" },
      { status: 400 }
    );
  }

  const uploadInfo = uploadsInProgress.get(fileId);

  if (!uploadInfo) {
    return NextResponse.json(
      { error: "Upload não encontrado ou já finalizado" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    fileId,
    originalName: uploadInfo.originalName,
    uploadedSize: uploadInfo.uploadedSize,
    totalSize: uploadInfo.totalSize,
    progress: Math.round(
      (uploadInfo.uploadedSize / uploadInfo.totalSize) * 100
    ),
    lastActivity: uploadInfo.lastChunk,
  });
}

// Implementar endpoint para limpar uploads abandonados
export async function DELETE(req: NextRequest) {
  // Apenas para administradores (adicione autenticação)
  const url = new URL(req.url);
  const fileId = url.searchParams.get("fileId");

  if (fileId) {
    // Remover upload específico
    const uploadInfo = uploadsInProgress.get(fileId);
    if (uploadInfo) {
      const tempDir = join(process.cwd(), "public", "uploads", "temp");
      const tempFilePath = join(tempDir, fileId);

      try {
        await Deno.remove(tempFilePath);
      } catch (e) {
        // Arquivo pode não existir
      }

      uploadsInProgress.delete(fileId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Upload não encontrado" },
      { status: 404 }
    );
  } else {
    // Limpar uploads abandonados (mais de 24h)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const abandonedUploads = [];

    uploadsInProgress.forEach((info, id) => {
      if (info.lastChunk < oneDayAgo) {
        abandonedUploads.push(id);
      }
    });

    for (const id of abandonedUploads) {
      const uploadInfo = uploadsInProgress.get(id);
      try {
        await Deno.remove(uploadInfo.tempPath);
      } catch (e) {
        // Arquivo pode não existir
      }
      uploadsInProgress.delete(id);
    }

    return NextResponse.json({
      success: true,
      cleaned: abandonedUploads.length,
    });
  }
}

// Configuração para permitir streaming e não usar o body parser
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};
