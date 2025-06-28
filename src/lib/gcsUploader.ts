import { Storage } from "@google-cloud/storage";
import path from "path";

const keyPath = path.join(process.cwd(), "gcp-key.json");

const storage = new Storage({
  keyFilename: keyPath,
});

const bucketName = "trusttech-storage";

export const uploadToGCS = async (
  file: Buffer,
  filename: string,
  mimetype: string
) => {
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      resolve(publicUrl);
    });
    blobStream.end(file);
  });
};
