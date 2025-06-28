import { Storage } from "@google-cloud/storage";
import path from "path";

const keyPath = path.join(process.cwd(), "gcp-key.json");

const storage = new Storage({
  keyFilename: keyPath,
});

const bucketName = "trusttech-storage";

// Upload simples para arquivos pequenos
export const uploadToGCS = async (
  file: Buffer,
  folder: string,
  filename: string,
  mimetype: string
): Promise<string> => {
  const bucket = storage.bucket(bucketName);
  const fullPath = `${folder}/${filename}`;
  const blob = bucket.file(fullPath);

  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      console.error("Erro no upload para GCS:", err);
      reject(err);
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fullPath}`;
      console.log(`Upload concluído: ${publicUrl}`);
      resolve(publicUrl);
    });

    blobStream.end(file);
  });
};

// Inicializar upload resumável para arquivos grandes
export const initResumableUpload = async (
  folder: string,
  filename: string,
  mimetype: string,
  fileSize: number
): Promise<{ stream: NodeJS.WritableStream; filename: string }> => {
  const bucket = storage.bucket(bucketName);
  const fullPath = `${folder}/${filename}`;
  const blob = bucket.file(fullPath);

  const stream = blob.createWriteStream({
    resumable: true,
    metadata: {
      contentType: mimetype,
      size: fileSize,
    },
    chunkSize: 5 * 1024 * 1024, // 5MB chunks
  });

  return { stream, filename: fullPath };
};

// Upload de um chunk
export const uploadChunk = async (
  stream: NodeJS.WritableStream,
  chunk: Buffer
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const writeSuccess = stream.write(chunk, (error) => {
      if (error) {
        console.error("Erro ao escrever chunk:", error);
        reject(error);
      } else {
        resolve();
      }
    });

    // Se o buffer interno está cheio, aguardar o drain
    if (!writeSuccess) {
      stream.once("drain", resolve);
    }
  });
};

// Finalizar upload resumável
export const finalizeResumableUpload = async (
  stream: NodeJS.WritableStream,
  filename: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    stream.on("error", (err) => {
      console.error("Erro ao finalizar upload:", err);
      reject(err);
    });

    stream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      console.log(`Upload resumável concluído: ${publicUrl}`);
      resolve(publicUrl);
    });

    // Finalizar o stream
    stream.end();
  });
};

// Função para verificar se um arquivo existe no GCS
export const fileExists = async (filename: string): Promise<boolean> => {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    console.error("Erro ao verificar existência do arquivo:", error);
    return false;
  }
};

// Função para deletar um arquivo do GCS
export const deleteFromGCS = async (filename: string): Promise<boolean> => {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    await file.delete();
    console.log(`Arquivo deletado: ${filename}`);
    return true;
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    return false;
  }
};

// Função para obter metadados de um arquivo
export const getFileMetadata = async (filename: string) => {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error("Erro ao obter metadados:", error);
    return null;
  }
};

// Função para gerar URL assinada (para downloads seguros)
export const generateSignedUrl = async (
  filename: string,
  expirationMinutes: number = 60
): Promise<string | null> => {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    const options = {
      version: "v4" as const,
      action: "read" as const,
      expires: Date.now() + expirationMinutes * 60 * 1000,
    };

    const [url] = await file.getSignedUrl(options);
    return url;
  } catch (error) {
    console.error("Erro ao gerar URL assinada:", error);
    return null;
  }
};

// Função para listar arquivos em uma pasta
export const listFiles = async (prefix: string) => {
  try {
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({ prefix });

    return files.map((file) => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      timeCreated: file.metadata.timeCreated,
      updated: file.metadata.updated,
    }));
  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    return [];
  }
};
