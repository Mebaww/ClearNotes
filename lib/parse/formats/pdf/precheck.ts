export interface PrecheckResult {
  valid: boolean;
  pageCount: number | null;
  error?: { code: "INVALID_FILE" | "PAGE_LIMIT_EXCEEDED"; message: string };
}

export class ParseError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export function ValidateFile(buffer: ArrayBuffer, pageLimit: number): PrecheckResult {
  const bytes = new Uint8Array(buffer);
  const signature = "%PDF-";
  const scanLimit = Math.min(bytes.length - signature.length + 1, 1024);
  let hasPdfSignature = false;

  for (let offset = 0; offset < scanLimit; offset++) {
    let matches = true;
    for (let i = 0; i < signature.length; i++) {
      if (String.fromCharCode(bytes[offset + i]) !== signature[i]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      hasPdfSignature = true;
      break;
    }
  }

  if (!hasPdfSignature) {
    return {
      valid: false,
      pageCount: null,
      error: { code: "INVALID_FILE", message: "The uploaded file is not a valid PDF." },
    };
  }

  const text = Buffer.from(bytes).toString("binary");
  const matches = [...text.matchAll(/\/Count\s+(\d+)/g)];

  if (matches.length === 0) {
    return { valid: true, pageCount: null };
  }

  const pageCount = Math.max(...matches.map((m) => parseInt(m[1], 10)));

  if (pageCount > pageLimit) {
    return {
      valid: false,
      pageCount,
      error: {
        code: "PAGE_LIMIT_EXCEEDED",
        message: `Document has ${pageCount} pages — the current limit is ${pageLimit}.`,
      },
    };
  }

  return { valid: true, pageCount };
}

// Stub for your actual pdf parser implementation
export interface ParsedDocument {
  pages: { content: string }[];
}
export async function parsePDFDocument(buffer: ArrayBuffer): Promise<ParsedDocument> {
  // Your pdf.js logic here
  return { pages: [] }; 
}