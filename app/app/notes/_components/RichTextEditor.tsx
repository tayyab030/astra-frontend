"use client"

import { useRef, useCallback } from "react"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Link,
  Image,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing... (Markdown supported)",
  className,
  minHeight = "min-h-[200px]",
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertFormatting = useCallback(
    (before: string, after = "", placeholder = "") => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = value.substring(start, end) || placeholder
      const newValue = value.substring(0, start) + before + selected + after + value.substring(end)
      onChange(newValue)

      requestAnimationFrame(() => {
        textarea.focus()
        const cursorPos = start + before.length + selected.length + after.length
        textarea.setSelectionRange(cursorPos, cursorPos)
      })
    },
    [value, onChange]
  )

  const tools = [
    { icon: Bold, action: () => insertFormatting("**", "**", "bold"), title: "Bold" },
    { icon: Italic, action: () => insertFormatting("*", "*", "italic"), title: "Italic" },
    { icon: Underline, action: () => insertFormatting("<u>", "</u>", "underline"), title: "Underline" },
    { icon: Heading1, action: () => insertFormatting("# ", "", "Heading"), title: "H1" },
    { icon: Heading2, action: () => insertFormatting("## ", "", "Heading"), title: "H2" },
    { icon: List, action: () => insertFormatting("- ", "", "item"), title: "Bullet List" },
    { icon: ListOrdered, action: () => insertFormatting("1. ", "", "item"), title: "Numbered List" },
    { icon: CheckSquare, action: () => insertFormatting("- [ ] ", "", "task"), title: "Checkbox" },
    { icon: Quote, action: () => insertFormatting("> ", "", "quote"), title: "Quote" },
    { icon: Code, action: () => insertFormatting("```\n", "\n```", "code"), title: "Code Block" },
    { icon: Link, action: () => insertFormatting("[", "](url)", "text"), title: "Link" },
    { icon: Image, action: () => insertFormatting("![", "](url)", "alt"), title: "Image" },
    { icon: Minus, action: () => insertFormatting("\n---\n", ""), title: "Divider" },
  ]

  return (
    <div className={cn("rounded-lg border border-slate-600/50 overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-slate-800/50 border-b border-slate-600/50">
        {tools.map((tool, i) => {
          const Icon = tool.icon
          return (
            <Toggle
              key={i}
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-300 data-[state=on]:text-cyan-300"
              onPressedChange={() => tool.action()}
              title={tool.title}
            >
              <Icon className="h-4 w-4" />
            </Toggle>
          )
        })}
        <Separator orientation="vertical" className="h-6 mx-1 bg-slate-600" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-slate-400 font-mono"
          onClick={() => insertFormatting("/")}
        >
          /
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "border-0 rounded-none resize-none font-inter text-base bg-slate-900/50 text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0",
          minHeight
        )}
      />
    </div>
  )
}
