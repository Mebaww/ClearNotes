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
    <article className="max-w-none overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className="mt-8 mb-4 text-3xl font-bold tracking-tight"
              {...props}
            />
          ),

          h2: ({ ...props }) => (
            <h2
              className="mt-8 mb-3 border-b pb-2 text-2xl font-semibold"
              {...props}
            />
          ),

          h3: ({ ...props }) => (
            <h3
              className="mt-6 mb-2 text-xl font-semibold"
              {...props}
            />
          ),

          p: ({ ...props }) => (
            <p
              className="mb-4 leading-7 text-muted-foreground"
              {...props}
            />
          ),

          ul: ({ ...props }) => (
            <ul
              className="mb-4 list-disc space-y-2 pl-6"
              {...props}
            />
          ),

          ol: ({ ...props }) => (
            <ol
              className="mb-4 list-decimal space-y-2 pl-6"
              {...props}
            />
          ),

          li: ({ ...props }) => (
            <li
              className="leading-7 text-muted-foreground"
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
              className="my-4 border-l-4 border-border pl-4 italic text-muted-foreground"
              {...props}
            />
          ),

          code: ({ className, ...props }) => (
            <code
              className={`rounded bg-muted px-1.5 py-0.5 text-sm ${className ?? ""}`}
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
            <table
              className="my-6 w-full border-collapse text-sm"
              {...props}
            />
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
              className="border border-border px-4 py-2 text-left font-semibold"
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
