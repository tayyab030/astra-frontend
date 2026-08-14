"use client"

import { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { sanitizeNoteHtml, toEditorHtml } from "@/lib/sanitizeNoteHtml"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
  /** Caps editor body height; content scrolls after this (e.g. ~5 lines). */
  maxHeight?: string
}

function isSafeHref(url: string) {
  const trimmed = url.trim().toLowerCase()
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
  className,
  minHeight = "min-h-[12rem]",
  maxHeight = "max-h-[12rem]",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // Keep code blocks; no raw HTML paste of scripts after sanitize
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
          class: "text-cyan-300 underline underline-offset-2",
        },
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          if (!isSafeHref(url)) return false
          return ctx.defaultValidate(url)
        },
        validate: (url) => isSafeHref(url),
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "max-w-full rounded-md",
        },
      }),
    ],
    content: toEditorHtml(value || ""),
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-invert prose-sm max-w-none px-3 py-2 focus:outline-none text-slate-100",
        ),
      },
      transformPastedHTML: (html) => sanitizeNoteHtml(html),
    },
    onUpdate: ({ editor: current }) => {
      onChange(sanitizeNoteHtml(current.getHTML()))
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = sanitizeNoteHtml(editor.getHTML())
    const incoming = sanitizeNoteHtml(toEditorHtml(value || ""))
    if (incoming !== current) {
      editor.commands.setContent(toEditorHtml(value || ""), { emitUpdate: false })
    }
  }, [value, editor])

  const setLink = () => {
    if (!editor) return
    const previous = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Enter a secure link (https:// only)", previous ?? "https://")
    if (url === null) return
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    if (!isSafeHref(url)) {
      window.alert("Only http:// and https:// links are allowed.")
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run()
  }

  const setImage = () => {
    if (!editor) return
    const url = window.prompt("Enter image URL (https:// only)")
    if (!url?.trim()) return
    if (!isSafeHref(url)) {
      window.alert("Only http:// and https:// image URLs are allowed.")
      return
    }
    editor.chain().focus().setImage({ src: url.trim() }).run()
  }

  if (!editor) return null

  const tools = [
    {
      icon: Bold,
      title: "Bold",
      active: editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      title: "Italic",
      active: editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: UnderlineIcon,
      title: "Underline",
      active: editor.isActive("underline"),
      action: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      icon: Heading1,
      title: "Heading 1",
      active: editor.isActive("heading", { level: 1 }),
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      title: "Heading 2",
      active: editor.isActive("heading", { level: 2 }),
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: List,
      title: "Bullet list",
      active: editor.isActive("bulletList"),
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      title: "Ordered list",
      active: editor.isActive("orderedList"),
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: Quote,
      title: "Quote",
      active: editor.isActive("blockquote"),
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: Code,
      title: "Code block",
      active: editor.isActive("codeBlock"),
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      icon: LinkIcon,
      title: "Link",
      active: editor.isActive("link"),
      action: setLink,
    },
    {
      icon: ImageIcon,
      title: "Image",
      active: false,
      action: setImage,
    },
    {
      icon: Minus,
      title: "Divider",
      active: false,
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ]

  return (
    <div className={cn("overflow-hidden rounded-lg border border-slate-600/50", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-600/50 bg-slate-800/50 p-2">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Toggle
              key={tool.title}
              size="sm"
              pressed={tool.active}
              onPressedChange={() => tool.action()}
              className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-300 data-[state=on]:text-cyan-300"
              title={tool.title}
              type="button"
            >
              <Icon className="h-4 w-4" />
            </Toggle>
          )
        })}
        <Separator orientation="vertical" className="mx-1 h-6 bg-slate-600" />
        <Toggle
          size="sm"
          pressed={false}
          onPressedChange={() => editor.chain().focus().undo().run()}
          className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-300"
          title="Undo"
          type="button"
        >
          <Undo2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={false}
          onPressedChange={() => editor.chain().focus().redo().run()}
          className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-300"
          title="Redo"
          type="button"
        >
          <Redo2 className="h-4 w-4" />
        </Toggle>
      </div>
      <div className={cn("overflow-y-auto bg-slate-900/50", minHeight, maxHeight)}>
        <EditorContent
          editor={editor}
          className={cn(
            "[&_.ProseMirror]:outline-none",
            "[&_.ProseMirror]:min-h-full",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-500",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          )}
        />
      </div>
    </div>
  )
}
