import DOMPurify from "isomorphic-dompurify"

/** Allowed tags for note rich text — no buttons, forms, scripts, or embeds. */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "a",
  "img",
  "hr",
  "span",
]

const ALLOWED_ATTR = ["href", "src", "alt", "title", "class", "target", "rel"]

function isSafeUrl(url: string | null): boolean {
  if (!url) return false
  const trimmed = url.trim().toLowerCase()
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("file:")
  ) {
    return false
  }
  // Allow relative paths and http(s) only
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return true
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
}

/**
 * Sanitize note HTML for storage and display.
 * Strips buttons, scripts, event handlers, and dangerous link protocols.
 */
export function sanitizeNoteHtml(dirty: string): string {
  if (!dirty?.trim()) return ""

  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: [
      "button",
      "input",
      "form",
      "textarea",
      "select",
      "option",
      "script",
      "iframe",
      "object",
      "embed",
      "link",
      "meta",
      "style",
      "svg",
      "math",
      "video",
      "audio",
      "source",
      "base",
    ],
    FORBID_ATTR: [
      "onclick",
      "ondblclick",
      "onmousedown",
      "onmouseup",
      "onmouseover",
      "onmouseout",
      "onmousemove",
      "onkeydown",
      "onkeypress",
      "onkeyup",
      "onload",
      "onerror",
      "onfocus",
      "onblur",
      "onchange",
      "onsubmit",
      "onreset",
      "style",
      "srcdoc",
      "formaction",
      "xlink:href",
    ],
  })

  // Extra pass: drop anchors/images with unsafe protocols (belt + suspenders)
  if (typeof window === "undefined") {
    return clean
  }

  const template = document.createElement("template")
  template.innerHTML = clean

  template.content.querySelectorAll("a").forEach((anchor) => {
    const href = anchor.getAttribute("href")
    if (!isSafeUrl(href)) {
      anchor.replaceWith(...Array.from(anchor.childNodes))
      return
    }
    anchor.setAttribute("rel", "noopener noreferrer nofollow")
    anchor.setAttribute("target", "_blank")
  })

  template.content.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src")
    if (!isSafeUrl(src)) {
      img.remove()
    }
  })

  template.content.querySelectorAll("button, input, form, script, iframe").forEach((el) => {
    el.remove()
  })

  return template.innerHTML
}

/** Ensure content is valid HTML for TipTap (wraps legacy plain text). */
export function toEditorHtml(value: string): string {
  const clean = sanitizeNoteHtml(value || "")
  if (!clean.trim()) return "<p></p>"
  if (/<[a-z][\s\S]*>/i.test(clean)) return clean

  const escaped = clean
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")

  return `<p>${escaped}</p>`
}

/** Plain-text excerpt for cards/lists (strips tags). */
export function noteHtmlToPlainText(html: string): string {
  if (!html?.trim()) return ""
  const withoutTags = html.replace(/<[^>]+>/g, " ")
  return withoutTags.replace(/\s+/g, " ").trim()
}
