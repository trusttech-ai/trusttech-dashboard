export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const CHUNK_SIZE = 2 * 1024 * 1024;
  const fileId = crypto.randomUUID();
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let uploadedChunks = 0;

  for (let start = 0; start < file.size; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
        "Content-Type": "application/octet-stream",
        "x-file-id": fileId,
        "x-file-name": file.name,
        "x-file-size": file.size.toString(),
      },
      body: chunk,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro no upload");
    }

    const data = await response.json();
    uploadedChunks++;

    // Reportar progresso
    if (onProgress) {
      onProgress(Math.round((uploadedChunks / totalChunks) * 100));
    }

    // Se o upload estiver completo, retornar a URL
    if (data.complete) {
      return data.url;
    }
  }

  // Verificar status final (não deveria chegar aqui)
  const statusResponse = await fetch(`/api/upload?fileId=${fileId}`, {
    method: "GET",
  });

  if (!statusResponse.ok) {
    throw new Error("Erro ao verificar status de upload");
  }

  const statusData = await statusResponse.json();

  if (!statusData.url) {
    throw new Error("Upload não foi concluído corretamente");
  }

  return statusData.url;
}
