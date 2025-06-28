import { NextRequest, NextResponse } from "next/server";
import { uploadToGCS } from "@/lib/gcsUploader";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Tipo de arquivo não permitido. Formatos aceitos: PDF, imagens, documentos do Office, texto, JSON, CSV" 
        },
        { status: 400 }
      );
    }

    // Validar tamanho do arquivo (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Arquivo muito grande. Tamanho máximo: 50MB" 
        },
        { status: 400 }
      );
    }

    // Preparar dados do arquivo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Gerar nome único para o arquivo
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const fileExtension = path.extname(file.name);
    const baseName = path.basename(file.name, fileExtension);
    const uniqueFileName = `${timestamp}_${baseName}${fileExtension}`;
    
    // Fazer upload para a pasta approval-pending
    const folderPath = "approval-pending";
    const fullPath = `${folderPath}/${uniqueFileName}`;
    const publicUrl = await uploadToGCS(
      buffer,
      fullPath,
      file.type
    );

    // Log do upload para auditoria
    console.log(`📤 Upload realizado:`, {
      originalName: file.name,
      uniqueName: uniqueFileName,
      size: file.size,
      type: file.type,
      category,
      description: description || 'Sem descrição',
      url: publicUrl,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "Arquivo enviado com sucesso para aprovação",
      file: {
        originalName: file.name,
        fileName: uniqueFileName,
        size: file.size,
        type: file.type,
        category,
        description: description || 'Sem descrição',
        url: publicUrl,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
