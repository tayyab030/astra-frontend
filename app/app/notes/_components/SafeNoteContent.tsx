"use client"

import { sanitizeNoteHtml } from "@/lib/sanitizeNoteHtml"
import { cn } from "@/lib/utils"

interface SafeNoteContentProps {
  html: string
  className?: string
}

/** Renders sanitized note HTML — never raw user HTML. */
export function SafeNoteContent({ html, className }: SafeNoteContentProps) {
  const clean = sanitizeNoteHtml(html)

  if (!clean.trim() || clean === "<p></p>") {
    return <p className={cn("text-sm text-slate-500 font-inter", className)}>No content</p>
  }

  return (
    <div
      className={cn(
        "prose prose-invert prose-sm max-w-none font-inter text-slate-300",
        "prose-a:text-cyan-300 prose-a:underline",
        "prose-headings:text-slate-100 prose-strong:text-slate-100",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
