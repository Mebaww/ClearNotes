// Runs before parsePdf — validates the file and checks page count from raw bytes,
// so we never spin up pdf.js on a bad or oversized file.

export interface PrecheckResult {
  valid: boolean;
  pageCount: number | null;
  error?: { code: "INVALID_FILE" | "PAGE_LIMIT_EXCEEDED"; message: string };
}

export function precheckPdf(buffer: ArrayBuffer, pageLimit: number): PrecheckResult {
  const bytes = new Uint8Array(buffer);

  // Real-world PDFs sometimes have a BOM or stray bytes before the signature.
  // Scan the first chunk instead of requiring %PDF- at byte 0.
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

  // PDFs store page count in /Count entries inside the Pages dictionary.
  // A page tree can have multiple nested /Count values — the largest is always the total.
  const text = Buffer.from(bytes).toString("binary");
  const matches = [...text.matchAll(/\/Count\s+(\d+)/g)];

  if (matches.length === 0) {
    // Valid PDF but couldn't read count from bytes — parsePdf will handle it
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