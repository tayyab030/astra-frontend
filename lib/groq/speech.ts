import {
  GROQ_SPEECH_URL,
  GROQ_TTS_MAX_CHARS,
  GROQ_TTS_MODEL,
  GROQ_TTS_VOICE,
  getGroqApiKey,
} from "./config"

export function sanitizeForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/[_#>[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function chunkForSpeech(text: string, maxChars = GROQ_TTS_MAX_CHARS): string[] {
  const cleaned = sanitizeForSpeech(text)
  if (!cleaned) return []
  if (cleaned.length <= maxChars) return [cleaned]

  const chunks: string[] = []
  let remaining = cleaned

  while (remaining.length > maxChars) {
    const window = remaining.slice(0, maxChars)
    const breakAt = Math.max(
      window.lastIndexOf(". "),
      window.lastIndexOf("! "),
      window.lastIndexOf("? "),
      window.lastIndexOf("; "),
      window.lastIndexOf(", "),
      window.lastIndexOf(" ")
    )
    const cut = breakAt > maxChars * 0.4 ? breakAt + 1 : maxChars
    chunks.push(remaining.slice(0, cut).trim())
    remaining = remaining.slice(cut).trim()
  }

  if (remaining) chunks.push(remaining)
  return chunks
}

export async function createSpeechWav(text: string): Promise<ArrayBuffer> {
  const apiKey = getGroqApiKey()
  if (!apiKey) {
    throw new Error("Missing CONSOLE_GROQ_API_KEY.")
  }

  const input = sanitizeForSpeech(text).slice(0, GROQ_TTS_MAX_CHARS)
  if (!input) {
    throw new Error("Nothing to speak.")
  }

  const response = await fetch(GROQ_SPEECH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "audio/wav",
    },
    body: JSON.stringify({
      model: GROQ_TTS_MODEL,
      voice: GROQ_TTS_VOICE,
      input,
      response_format: "wav",
    }),
  })

  if (!response.ok) {
    let detail = `Groq TTS failed (${response.status})`
    try {
      const err = (await response.json()) as { error?: { message?: string } }
      if (err.error?.message) detail = err.error.message
    } catch {
      // ignore
    }
    throw new Error(detail)
  }

  const contentType = response.headers.get("content-type") ?? ""
  const buffer = await response.arrayBuffer()
  if (!buffer.byteLength) {
    throw new Error("Groq returned empty audio.")
  }

  // Guard against JSON error bodies returned with odd status handling.
  if (contentType.includes("application/json")) {
    try {
      const err = JSON.parse(new TextDecoder().decode(buffer)) as {
        error?: { message?: string }
      }
      throw new Error(err.error?.message ?? "Groq TTS returned JSON instead of audio.")
    } catch (error) {
      if (error instanceof Error && error.message.includes("Groq")) throw error
      throw new Error("Groq TTS returned an unexpected response.")
    }
  }

  return buffer
}
