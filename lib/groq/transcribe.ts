import { GROQ_TRANSCRIBE_URL, GROQ_WHISPER_MODEL, getGroqApiKey } from "./config"

export async function transcribeAudioBlob(
  file: Blob,
  fileName = "voice.webm"
): Promise<string> {
  const apiKey = getGroqApiKey()
  if (!apiKey) {
    throw new Error("Missing CONSOLE_GROQ_API_KEY.")
  }

  const formData = new FormData()
  formData.append("file", file, fileName)
  formData.append("model", GROQ_WHISPER_MODEL)
  formData.append("language", "en")
  formData.append("response_format", "json")
  formData.append("temperature", "0")

  const response = await fetch(GROQ_TRANSCRIBE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  })

  const data = (await response.json()) as { text?: string; error?: { message?: string } }
  if (!response.ok) {
    throw new Error(data.error?.message ?? `Whisper failed (${response.status})`)
  }

  const text = data.text?.trim() ?? ""
  if (!text) {
    throw new Error("I didn't catch that. Please try again.")
  }

  return text
}
