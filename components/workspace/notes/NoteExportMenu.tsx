"use client";

import { useState } from "react";
import { Download, FileText, FileDown, ChevronDown } from "lucide-react";
import { Note } from "@/types/note";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadMarkdownFile, downloadNoteAsPdf } from "@/lib/export/exportNote";
import { sileo } from "sileo";

interface NoteExportMenuProps {
  note: Pick<Note, "id" | "title" | "generated"> & { createdAt?: Date | string };
  variant?: "default" | "card";
  align?: "end" | "start" | "center";
  className?: string;
  onExportPdf?: () => void;
  targetRef?: React.RefObject<HTMLDivElement | null>;
}

export function NoteExportMenu({
  note,
  variant = "default",
  align = "end",
  className = "",
  onExportPdf,
  targetRef,
}: NoteExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!note.generated) {
      sileo.error({
        title: "Cannot export note",
        description: "This note has no generated content to export.",
      });
      return;
    }

    if (onExportPdf) {
      onExportPdf();
      return;
    }

    if (isExporting) return;
    setIsExporting(true);

    const pdfPromise = downloadNoteAsPdf({
      title: note.title,
      date: note.createdAt,
      element:
        targetRef?.current ||
        (typeof document !== "undefined"
          ? document.getElementById("clearnotes-rendered-note")
          : null),
    });

    sileo.promise(pdfPromise, {
      loading: {
        title: "Generating PDF...",
        description: "Converting note to PDF",
      },
      success: {
        title: "PDF downloaded!",
        description: `${note.title || "Note"}.pdf saved to your downloads`,
      },
      error: {
        title: "Failed to generate PDF",
        description: "An unexpected error occurred. Please try again.",
      },
    });

    try {
      await pdfPromise;
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMarkdown = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const success = downloadMarkdownFile(note.title, note.generated);

    if (success) {
      sileo.success({
        title: "Markdown downloaded!",
        description: `Saved as ${note.title || "note"}.md`,
      });
    } else {
      sileo.error({
        title: "Cannot download note",
        description: "This note has no generated content to download.",
      });
    }
  };

  if (variant === "card") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            title="Export note"
            aria-label="Export note"
            disabled={isExporting}
            className={`flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 ${className}`}
          >
            <Download className="size-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="w-48"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-semibold">
            Export Note
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-xs cursor-pointer gap-2"
            onClick={handleExportPdf}
          >
            <FileText className="size-3.5 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="font-medium">Download as PDF</span>
              <span className="text-[10px] text-muted-foreground">Formatted PDF document</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-xs cursor-pointer gap-2"
            onClick={handleExportMarkdown}
          >
            <FileDown className="size-3.5 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="font-medium">Download Markdown</span>
              <span className="text-[10px] text-muted-foreground">Raw .md file</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          className={`gap-1.5 cursor-pointer shrink-0 ${className}`}
        >
          <Download className="size-3.5" />
          <span>{isExporting ? "Exporting..." : "Export"}</span>
          <ChevronDown className="size-3 opacity-60 ml-0.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Export Document
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2 py-2"
          onClick={handleExportPdf}
        >
          <FileText className="size-4 text-primary shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-medium">Download as PDF</span>
            <span className="text-[10px] text-muted-foreground">Direct .pdf download</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer gap-2 py-2"
          onClick={handleExportMarkdown}
        >
          <FileDown className="size-4 text-primary shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-medium">Download Markdown</span>
            <span className="text-[10px] text-muted-foreground">Raw .md document</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
