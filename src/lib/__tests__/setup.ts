// Setup file para Jest
import "jest-environment-jsdom";

// Mock global.crypto se não existir
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "test-uuid"),
  },
});

// Mock global.fetch
global.fetch = jest.fn();

// Mock File e Blob se necessário
if (typeof global.File === "undefined") {
  global.File = class File {
    name: string;
    size: number;
    type: string;
    content: string;

    constructor(content: string[], name: string, options?: { type?: string }) {
      this.name = name;
      this.type = options?.type || "";
      this.content = content.join("");
      this.size = this.content.length;
    }

    slice(start?: number, end?: number): Blob {
      const slicedContent = this.content.slice(start, end);
      return new Blob([slicedContent], { type: this.type });
    }
  } as any;
}

if (typeof global.Blob === "undefined") {
  global.Blob = class Blob {
    size: number;
    type: string;
    content: string;

    constructor(content: string[], options?: { type?: string }) {
      this.type = options?.type || "";
      this.content = content.join("");
      this.size = this.content.length;
    }
  } as any;
}
