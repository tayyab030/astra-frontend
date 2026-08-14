export const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
export const GROQ_SPEECH_URL = "https://api.groq.com/openai/v1/audio/speech"
export const GROQ_TRANSCRIBE_URL = "https://api.groq.com/openai/v1/audio/transcriptions"

export const GROQ_MODEL = "llama-3.3-70b-versatile"
export const GROQ_WHISPER_MODEL = "whisper-large-v3-turbo"
export const GROQ_TTS_MODEL = "canopylabs/orpheus-v1-english"
export const GROQ_TTS_VOICE = "troy"
export const GROQ_TTS_MAX_CHARS = 200

export function getGroqApiKey(): string {
  const fromEnv = process.env.CONSOLE_GROQ_API_KEY
  if (typeof fromEnv === "string" && fromEnv.trim()) {
    return fromEnv.trim()
  }
  return ""
}

export function hasGroqApiKey() {
  return getGroqApiKey().length > 0
}
