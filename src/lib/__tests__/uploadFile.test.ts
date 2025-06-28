import { uploadFile } from "../uploadFile";

// Mock global fetch
global.fetch = jest.fn();

// Função helper para criar mocks de resposta em chunks
function createChunkMocks(
  totalSize: number,
  chunkSize: number = 2 * 1024 * 1024
) {
  const totalChunks = Math.ceil(totalSize / chunkSize);
  const mocks: any[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const isLastChunk = i === totalChunks - 1;
    const receivedSize = Math.min((i + 1) * chunkSize, totalSize);

    mocks.push({
      ok: true,
      json: jest.fn().mockResolvedValue({
        complete: isLastChunk,
        success: true,
        received: receivedSize,
        total: totalSize,
        ...(isLastChunk && { url: "/uploads/2025/06/test-file-id-123.bin" }),
      }),
    });
  }

  return mocks;
}

describe("uploadFile - Testes por Tamanho de Arquivo", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    Object.defineProperty(global, "crypto", {
      value: {
        randomUUID: jest.fn(() => "test-file-id-123"),
      },
    });
  });

  it("deve fazer upload de arquivo de 20MB", async () => {
    const fileSize = 20 * 1024 * 1024; // 20MB
    const mockFile = {
      name: "arquivo-20mb.bin",
      size: fileSize,
      type: "application/octet-stream",
      slice: jest.fn((start: number, end: number) => ({
        size: end - start,
        type: "application/octet-stream",
      })),
    } as unknown as File;

    const CHUNK_SIZE = 2 * 1024 * 1024;
    const expectedChunks = Math.ceil(fileSize / CHUNK_SIZE); // 10 chunks
    const mockResponses = createChunkMocks(fileSize);

    // Setup fetch mocks
    mockResponses.forEach((response) => {
      (fetch as jest.Mock).mockResolvedValueOnce(response);
    });

    const onProgress = jest.fn();

    // Act
    const result = await uploadFile(mockFile, onProgress);

    // Assert
    expect(fetch).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenLastCalledWith(100);
    expect(result).toBe("/uploads/2025/06/test-file-id-123.bin");

    // Verificar primeiro chunk
    expect(fetch).toHaveBeenNthCalledWith(1, "/api/upload", {
      method: "POST",
      headers: {
        "Content-Range": `bytes 0-${CHUNK_SIZE - 1}/${fileSize}`,
        "Content-Type": "application/octet-stream",
        "x-file-id": "test-file-id-123",
        "x-file-name": "arquivo-20mb.bin",
        "x-file-size": fileSize.toString(),
      },
      body: expect.any(Object),
    });
  });

  it("deve fazer upload de arquivo de 200MB", async () => {
    // Arrange
    const fileSize = 200 * 1024 * 1024; // 200MB
    const mockFile = {
      name: "arquivo-200mb.bin",
      size: fileSize,
      type: "application/octet-stream",
      slice: jest.fn((start: number, end: number) => ({
        size: end - start,
        type: "application/octet-stream",
      })),
    } as unknown as File;

    const CHUNK_SIZE = 2 * 1024 * 1024;
    const expectedChunks = Math.ceil(fileSize / CHUNK_SIZE); // 100 chunks
    const mockResponses = createChunkMocks(fileSize);

    // Setup fetch mocks
    mockResponses.forEach((response) => {
      (fetch as jest.Mock).mockResolvedValueOnce(response);
    });

    const onProgress = jest.fn();

    // Act
    const result = await uploadFile(mockFile, onProgress);

    // Assert
    expect(fetch).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenLastCalledWith(100);
    expect(result).toBe("/uploads/2025/06/test-file-id-123.bin");

    // Verificar que o progresso foi reportado corretamente
    const progressValues = onProgress.mock.calls.map((call) => call[0]);
    expect(progressValues).toContain(1); // ~1% no primeiro chunk
    expect(progressValues).toContain(50); // ~50% no meio
    expect(progressValues).toContain(100); // 100% no final
  });

  it("deve fazer upload de arquivo de 900MB", async () => {
    // Arrange
    const fileSize = 900 * 1024 * 1024; // 900MB
    const mockFile = {
      name: "arquivo-900mb.bin",
      size: fileSize,
      type: "application/octet-stream",
      slice: jest.fn((start: number, end: number) => ({
        size: end - start,
        type: "application/octet-stream",
      })),
    } as unknown as File;

    const CHUNK_SIZE = 2 * 1024 * 1024;
    const expectedChunks = Math.ceil(fileSize / CHUNK_SIZE); // 450 chunks
    const mockResponses = createChunkMocks(fileSize);

    // Setup fetch mocks
    mockResponses.forEach((response) => {
      (fetch as jest.Mock).mockResolvedValueOnce(response);
    });

    const onProgress = jest.fn();

    // Act
    const result = await uploadFile(mockFile, onProgress);

    // Assert
    expect(fetch).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenLastCalledWith(100);
    expect(result).toBe("/uploads/2025/06/test-file-id-123.bin");

    // Verificar headers do último chunk
    const lastCallIndex = expectedChunks;
    const lastChunkStart = (expectedChunks - 1) * CHUNK_SIZE;
    expect(fetch).toHaveBeenNthCalledWith(lastCallIndex, "/api/upload", {
      method: "POST",
      headers: {
        "Content-Range": `bytes ${lastChunkStart}-${fileSize - 1}/${fileSize}`,
        "Content-Type": "application/octet-stream",
        "x-file-id": "test-file-id-123",
        "x-file-name": "arquivo-900mb.bin",
        "x-file-size": fileSize.toString(),
      },
      body: expect.any(Object),
    });
  });

  it("deve fazer upload de arquivo de 1.5GB", async () => {
    // Arrange
    const fileSize = Math.floor(1.5 * 1024 * 1024 * 1024); // 1.5GB
    const mockFile = {
      name: "arquivo-1-5gb.bin",
      size: fileSize,
      type: "application/octet-stream",
      slice: jest.fn((start: number, end: number) => ({
        size: end - start,
        type: "application/octet-stream",
      })),
    } as unknown as File;

    const CHUNK_SIZE = 2 * 1024 * 1024;
    const expectedChunks = Math.ceil(fileSize / CHUNK_SIZE); // 768 chunks
    const mockResponses = createChunkMocks(fileSize);

    // Setup fetch mocks
    mockResponses.forEach((response) => {
      (fetch as jest.Mock).mockResolvedValueOnce(response);
    });

    const onProgress = jest.fn();

    // Act
    const result = await uploadFile(mockFile, onProgress);

    // Assert
    expect(fetch).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenLastCalledWith(100);
    expect(result).toBe("/uploads/2025/06/test-file-id-123.bin");

    // Verificar que o arquivo foi dividido corretamente
    expect(mockFile.slice).toHaveBeenCalledTimes(expectedChunks);

    // Verificar o primeiro slice
    expect(mockFile.slice).toHaveBeenNthCalledWith(1, 0, CHUNK_SIZE);

    // Verificar o último slice
    const lastChunkStart = (expectedChunks - 1) * CHUNK_SIZE;
    expect(mockFile.slice).toHaveBeenNthCalledWith(
      expectedChunks,
      lastChunkStart,
      fileSize
    );
  });

  it("deve fazer upload de arquivo de 6GB", async () => {
    // Arrange
    const fileSize = 6 * 1024 * 1024 * 1024; // 6GB
    const mockFile = {
      name: "arquivo-6gb.bin",
      size: fileSize,
      type: "application/octet-stream",
      slice: jest.fn((start: number, end: number) => ({
        size: end - start,
        type: "application/octet-stream",
      })),
    } as unknown as File;

    const CHUNK_SIZE = 2 * 1024 * 1024;
    const expectedChunks = Math.ceil(fileSize / CHUNK_SIZE); // 3072 chunks
    const mockResponses = createChunkMocks(fileSize);

    // Setup fetch mocks
    mockResponses.forEach((response) => {
      (fetch as jest.Mock).mockResolvedValueOnce(response);
    });

    const onProgress = jest.fn();

    // Act
    const result = await uploadFile(mockFile, onProgress);

    // Assert
    expect(fetch).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenCalledTimes(expectedChunks);
    expect(onProgress).toHaveBeenLastCalledWith(100);
    expect(result).toBe("/uploads/2025/06/test-file-id-123.bin");

    // Verificar que o progresso é reportado incrementalmente
    const progressValues = onProgress.mock.calls.map((call) => call[0]);

    // Deve ter progressos graduais
    expect(progressValues[0]).toBeLessThan(1); // Primeiro chunk < 1%
    expect(progressValues[Math.floor(expectedChunks / 4)]).toBeCloseTo(25, 0); // ~25% no primeiro quarto
    expect(progressValues[Math.floor(expectedChunks / 2)]).toBeCloseTo(50, 0); // ~50% na metade
    expect(progressValues[Math.floor((expectedChunks * 3) / 4)]).toBeCloseTo(
      75,
      0
    ); // ~75% no terceiro quarto
    expect(progressValues[expectedChunks - 1]).toBe(100); // 100% no final

    // Verificar que os headers estão corretos para um arquivo tão grande
    expect(fetch).toHaveBeenNthCalledWith(1, "/api/upload", {
      method: "POST",
      headers: {
        "Content-Range": `bytes 0-${CHUNK_SIZE - 1}/${fileSize}`,
        "Content-Type": "application/octet-stream",
        "x-file-id": "test-file-id-123",
        "x-file-name": "arquivo-6gb.bin",
        "x-file-size": fileSize.toString(),
      },
      body: expect.any(Object),
    });
  });
});
