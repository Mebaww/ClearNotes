"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface Props {
  content: string;
}

export function MarkdownContent({ content }: Props) {
  return (
    <article className="w-full min-w-0 max-w-full break-words [overflow-wrap:anywhere] [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:max-w-full [&_.katex-display]:py-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className="mt-8 mb-4 text-2xl sm:text-3xl font-bold tracking-tight break-words [overflow-wrap:anywhere]"
              {...props}
            />
          ),

          h2: ({ ...props }) => (
            <h2
              className="mt-8 mb-3 border-b pb-2 text-xl sm:text-2xl font-semibold break-words [overflow-wrap:anywhere]"
              {...props}
            />
          ),

          h3: ({ ...props }) => (
            <h3
              className="mt-6 mb-2 text-lg sm:text-xl font-semibold break-words [overflow-wrap:anywhere]"
              {...props}
            />
          ),

          h4: ({ ...props }) => (
            <h4
              className="mt-4 mb-2 text-base sm:text-lg font-semibold break-words [overflow-wrap:anywhere]"
              {...props}
            />
          ),

          p: ({ ...props }) => (
            <p
              className="mb-4 leading-7 text-muted-foreground break-words [overflow-wrap:anywhere]"
              {...props}
            />
          ),

          a: ({ ...props }) => (
            <a
              className="text-primary underline underline-offset-4 hover:opacity-80 break-words [overflow-wrap:anywhere]"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          ul: ({ ...props }) => (
            <ul
              className="mb-4 list-disc space-y-2 pl-6 break-words [overflow-wrap:anywhere]"
              {...props}
            />
          ),

          ol: ({ ...props }) => (
            <ol
              className="mb-4 list-decimal space-y-2 pl-6 break-words [overflow-wrap:anywhere]"
              {...props}
            />
          ),

          li: ({ ...props }) => (
            <li
              className="leading-7 text-muted-foreground break-words [overflow-wrap:anywhere]"
              {...props}
            />
          ),

          strong: ({ ...props }) => (
            <strong
              className="font-semibold text-foreground"
              {...props}
            />
          ),

          blockquote: ({ ...props }) => (
            <blockquote
              className="my-4 border-l-4 border-border pl-4 italic text-muted-foreground break-words [overflow-wrap:anywhere]"
              {...props}
            />
          ),

          pre: ({ ...props }) => (
            <div className="my-4 w-full max-w-full overflow-x-auto rounded-lg bg-muted border border-border/60">
              <pre
                className="p-4 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto"
                {...props}
              />
            </div>
          ),

          code: ({ className, ...props }) => (
            <code
              className={`rounded bg-muted px-1.5 py-0.5 text-xs sm:text-sm font-mono break-words [overflow-wrap:anywhere] ${className ?? ""}`}
              {...props}
            />
          ),

          hr: ({ ...props }) => (
            <hr
              className="my-8 border-border"
              {...props}
            />
          ),

          table: ({ ...props }) => (
            <div className="my-6 w-full max-w-full overflow-x-auto rounded-lg border border-border">
              <table
                className="w-full border-collapse text-sm min-w-full"
                {...props}
              />
            </div>
          ),

          thead: ({ ...props }) => (
            <thead
              className="bg-muted"
              {...props}
            />
          ),

          tbody: ({ ...props }) => (
            <tbody {...props} />
          ),

          tr: ({ ...props }) => (
            <tr
              className="border-b border-border"
              {...props}
            />
          ),

          th: ({ ...props }) => (
            <th
              className="border border-border px-4 py-2 text-left font-semibold whitespace-nowrap"
              {...props}
            />
          ),

          td: ({ ...props }) => (
            <td
              className="border border-border px-4 py-2 align-top text-muted-foreground"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
