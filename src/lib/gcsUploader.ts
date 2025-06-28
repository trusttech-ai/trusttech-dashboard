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
  folderPath: string,
  filename: string,
  mimetype: string
) => {
  const bucket = storage.bucket(bucketName);
  // Combinar o path da pasta com o nome do arquivo
  const fullPath = `${folderPath}/${filename}`;
  const blob = bucket.file(fullPath);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: mimetype,
  });

  return new Promise<string>((resolve, reject) => {
    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fullPath}`;
      resolve(publicUrl);
    });
    blobStream.end(file);
  });
};

// Upload resumável para arquivos grandes (por chunks)
export const initResumableUpload = async (
  folderPath: string,
  filename: string,
  mimetype: string,
  totalSize: number
) => {
  const bucket = storage.bucket(bucketName);
  // Combinar o path da pasta com o nome do arquivo
  const fullPath = `${folderPath}/${filename}`;
  const blob = bucket.file(fullPath);

  // Criar stream resumável
  const blobStream = blob.createWriteStream({
    resumable: true,
    contentType: mimetype,
    metadata: {
      contentType: mimetype,
    },
  });

  return {
    stream: blobStream,
    filename: fullPath, // Retornar o path completo
    totalSize,
  };
};

// Upload de chunk individual
export const uploadChunk = async (
  stream: NodeJS.WritableStream,
  chunk: Buffer
): Promise<void> => {
  return new Promise((resolve, reject) => {
    stream.write(chunk, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Finalizar upload resumável
export const finalizeResumableUpload = async (
  stream: NodeJS.WritableStream,
  filename: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    stream.on("error", (err) => reject(err));
    stream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      resolve(publicUrl);
    });
    stream.end();
  });
};
