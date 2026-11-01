// Strip invalid filesystem characters and limit filename length
export function sanitizeFilename(
  title: string | null | undefined,
  fallback = "note"
): string {
  if (!title || !title.trim()) {
    return fallback;
  }

  const cleaned = title
    .trim()
    .replace(/[/\\?%*:|"<>#]/g, "-")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return cleaned || fallback;
}

// Generate and trigger download for markdown file in browser
export function downloadMarkdownFile(
  title: string | null | undefined,
  content: string | null | undefined
): boolean {
  if (!content) {
    return false;
  }

  const safeTitle = sanitizeFilename(title, "untitled-note");

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeTitle}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

interface ExportPdfOptions {
  title?: string | null;
  date?: Date | string | null;
  element?: HTMLElement | null;
}

// Convert rendered note into styled A4 layout and trigger PDF download
export async function downloadNoteAsPdf({
  title,
  date,
  element,
}: ExportPdfOptions): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  const sourceElement =
    element ||
    document.getElementById("clearnotes-rendered-note") ||
    document.querySelector("article");

  if (!sourceElement) {
    throw new Error("Could not find note content to export.");
  }

  if (!sourceElement.innerText?.trim() && !sourceElement.innerHTML?.trim()) {
    throw new Error("The note has no content to export.");
  }

  const safeTitle = sanitizeFilename(title, "untitled-note");

  const formattedDate = date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const printDoc = document.createElement("div");
  printDoc.className = "clearnotes-pdf-wrapper";
  printDoc.style.cssText = `
    width: 794px;
    max-width: 794px;
    padding: 36px 44px;
    background-color: #ffffff;
    color: #111827;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 1.65;
    box-sizing: border-box;
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    .clearnotes-pdf-wrapper {
      --foreground: #111827 !important;
      --muted-foreground: #374151 !important;
      --card-foreground: #111827 !important;
      --border: #d1d5db !important;
      --primary: #b8863b !important;
      background-color: #ffffff !important;
      color: #111827 !important;
    }
    .clearnotes-pdf-wrapper * {
      box-sizing: border-box !important;
    }
    .clearnotes-pdf-wrapper h1 {
      font-size: 22px !important;
      font-weight: 700 !important;
      color: #0f172a !important;
      margin: 20px 0 10px 0 !important;
      line-height: 1.3 !important;
      page-break-after: avoid;
      break-after: avoid;
    }
    .clearnotes-pdf-wrapper h2 {
      font-size: 17px !important;
      font-weight: 600 !important;
      color: #0f172a !important;
      margin: 22px 0 8px 0 !important;
      border-bottom: 2px solid #e2e8f0 !important;
      padding-bottom: 4px !important;
      page-break-after: avoid;
      break-after: avoid;
    }
    .clearnotes-pdf-wrapper h3 {
      font-size: 14px !important;
      font-weight: 600 !important;
      color: #0f172a !important;
      margin: 16px 0 6px 0 !important;
      page-break-after: avoid;
      break-after: avoid;
    }
    .clearnotes-pdf-wrapper h4 {
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #1e293b !important;
      margin: 12px 0 4px 0 !important;
    }
    .clearnotes-pdf-wrapper p {
      color: #1f2937 !important;
      margin: 0 0 12px 0 !important;
      line-height: 1.65 !important;
    }
    .clearnotes-pdf-wrapper strong,
    .clearnotes-pdf-wrapper b {
      color: #000000 !important;
      font-weight: 700 !important;
    }
    .clearnotes-pdf-wrapper ul,
    .clearnotes-pdf-wrapper ol {
      margin: 0 0 12px 0 !important;
      padding-left: 22px !important;
      color: #1f2937 !important;
    }
    .clearnotes-pdf-wrapper li {
      margin-bottom: 4px !important;
      line-height: 1.6 !important;
      color: #1f2937 !important;
    }
    .clearnotes-pdf-wrapper pre {
      background-color: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 6px !important;
      padding: 12px 14px !important;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
      font-size: 11px !important;
      line-height: 1.55 !important;
      color: #0f172a !important;
      white-space: pre-wrap !important;
      word-break: break-word !important;
      margin: 14px 0 !important;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .clearnotes-pdf-wrapper code {
      background-color: #f1f5f9 !important;
      border: 1px solid #e2e8f0 !important;
      color: #0f172a !important;
      padding: 2px 5px !important;
      border-radius: 4px !important;
      font-family: monospace !important;
      font-size: 11px !important;
      font-weight: 600 !important;
    }
    .clearnotes-pdf-wrapper table {
      width: 100% !important;
      max-width: 100% !important;
      border-collapse: collapse !important;
      margin: 16px 0 !important;
      font-size: 11px !important;
      border: 1px solid #cbd5e1 !important;
      page-break-inside: avoid;
      break-inside: avoid;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
    }
    .clearnotes-pdf-wrapper th {
      background-color: #f1f5f9 !important;
      border: 1px solid #cbd5e1 !important;
      padding: 8px 10px !important;
      text-align: left !important;
      font-weight: 700 !important;
      color: #0f172a !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
    }
    .clearnotes-pdf-wrapper td {
      border: 1px solid #e2e8f0 !important;
      padding: 8px 12px !important;
      color: #1f2937 !important;
      line-height: 1.5 !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
    }
    .clearnotes-pdf-wrapper blockquote {
      border-left: 3px solid #b8863b !important;
      background-color: #fafaf9 !important;
      padding: 8px 14px !important;
      margin: 14px 0 !important;
      color: #374151 !important;
      font-style: italic !important;
    }
    .clearnotes-pdf-wrapper .katex,
    .clearnotes-pdf-wrapper .katex * {
      color: #0f172a !important;
    }
    .clearnotes-pdf-wrapper .katex-display {
      overflow: visible !important;
      margin: 10px 0 !important;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .clearnotes-pdf-wrapper a {
      color: #b8863b !important;
      text-decoration: underline !important;
      font-weight: 500 !important;
    }
    .clearnotes-pdf-wrapper img {
      max-width: 100% !important;
      height: auto !important;
      border-radius: 4px !important;
      margin: 12px 0 !important;
      page-break-inside: avoid;
    }
  `;
  printDoc.appendChild(styleTag);

  const header = document.createElement("div");
  header.style.cssText =
    "margin-bottom: 22px; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-end;";
  header.innerHTML = `
    <div>
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #b8863b;">ClearNotes</div>
      ${title ? `<div style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px;">${title}</div>` : ""}
    </div>
    ${formattedDate ? `<div style="font-size: 11px; font-weight: 500; color: #4b5563;">${formattedDate}</div>` : ""}
  `;
  printDoc.appendChild(header);

  const body = document.createElement("div");
  body.className = "clearnotes-pdf-body";
  body.innerHTML = sourceElement.innerHTML;
  printDoc.appendChild(body);

  const footer = document.createElement("div");
  footer.style.cssText =
    "margin-top: 36px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; font-weight: 500; color: #6b7280; text-align: center;";
  footer.textContent =
    "Generated with ClearNotes • Less Reading. More Understanding.";
  printDoc.appendChild(footer);

  const html2pdfModule = await import("html2pdf.js");
  const html2pdf = html2pdfModule.default || html2pdfModule;

  const opt = {
    margin: [10, 10, 12, 10] as [number, number, number, number],
    filename: `${safeTitle}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: 1024,
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
      avoid: ["h1", "h2", "h3", "h4", "pre", "table", "tr", ".katex-display"],
    },
  };

  await html2pdf().set(opt).from(printDoc).save();
  return true;
}
