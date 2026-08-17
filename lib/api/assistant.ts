import { authApi } from "./simpleApi"
import { API_ENDPOINTS } from "./endpoints"

const { ASSISTANT } = API_ENDPOINTS

export type AssistantRole = "user" | "assistant"

export type AssistantConversation = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export type AssistantChatMessage = {
  id: string
  conversation_id: string
  role: AssistantRole
  content: string
  created_at: string
}

export type SendAssistantMessageResponse = {
  conversation: AssistantConversation
  user_message: AssistantChatMessage
  assistant_message: AssistantChatMessage
}

export async function sendAssistantMessage(options: {
  message: string
  conversationId?: string | null
}) {
  const response = await authApi.post<SendAssistantMessageResponse>(ASSISTANT.CHAT, {
    message: options.message,
    conversation_id: options.conversationId || undefined,
  })
  return response.data
}

export async function listAssistantConversations() {
  const response = await authApi.get<AssistantConversation[]>(ASSISTANT.CONVERSATIONS)
  return response.data
}

export type DailyQuoteResponse = {
  quote: string
  date: string
  source: "groq" | "cache" | "fallback"
}

export async function fetchDailyQuote() {
  const response = await authApi.get<DailyQuoteResponse>(ASSISTANT.DAILY_QUOTE)
  return response.data
}

export async function fetchGoalsQuote() {
  const response = await authApi.get<DailyQuoteResponse>(ASSISTANT.GOALS_QUOTE)
  return response.data
}

export async function getAssistantConversation(id: string) {
  const response = await authApi.get<{
    conversation: AssistantConversation
    messages: AssistantChatMessage[]
  }>(ASSISTANT.CONVERSATION(id))
  return response.data
}

export async function createAssistantConversation(title?: string) {
  const response = await authApi.post<AssistantConversation>(ASSISTANT.CONVERSATIONS, {
    title,
  })
  return response.data
}

export async function deleteAssistantConversation(id: string) {
  const response = await authApi.delete<{ message: string }>(ASSISTANT.CONVERSATION(id))
  return response.data
}

export async function updateAssistantConversation(id: string, title: string) {
  const response = await authApi.patch<AssistantConversation>(ASSISTANT.CONVERSATION(id), {
    title,
  })
  return response.data
}

export async function fetchAssistantSpeechWav(text: string) {
  try {
    const response = await authApi.post<ArrayBuffer>(
      ASSISTANT.SPEECH,
      { text },
      { responseType: "arraybuffer" }
    )
    return response.data
  } catch (error) {
    throw decodeSpeechError(error)
  }
}

export async function transcribeAssistantAudioFile(file: Blob, fileName = "voice.webm") {
  const formData = new FormData()
  formData.append("file", file, fileName)
  const response = await authApi.post<{ text: string }>(ASSISTANT.TRANSCRIBE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data.text
}

function decodeSpeechError(error: unknown): Error {
  const responseData = (error as { response?: { data?: unknown } })?.response?.data
  const message = parseSpeechErrorPayload(responseData)
  if (message) return new Error(message)
  if (error instanceof Error && error.message) return error
  return new Error("Speech request failed.")
}

function parseSpeechErrorPayload(data: unknown): string | null {
  if (!data) return null

  if (typeof data === "string") {
    try {
      return parseSpeechErrorPayload(JSON.parse(data))
    } catch {
      return data.trim() || null
    }
  }

  if (typeof ArrayBuffer !== "undefined" && data instanceof ArrayBuffer) {
    try {
      const text = new TextDecoder().decode(data)
      return parseSpeechErrorPayload(JSON.parse(text))
    } catch {
      return null
    }
  }

  if (typeof Uint8Array !== "undefined" && data instanceof Uint8Array) {
    try {
      const text = new TextDecoder().decode(data)
      return parseSpeechErrorPayload(JSON.parse(text))
    } catch {
      return null
    }
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>
    if (typeof record.message === "string") return record.message
    if (Array.isArray(record.message) && typeof record.message[0] === "string") {
      return record.message[0]
    }
    if (typeof record.detail === "string") return record.detail
    if (typeof record.error === "string") return record.error
    if (
      record.error &&
      typeof record.error === "object" &&
      typeof (record.error as { message?: unknown }).message === "string"
    ) {
      return (record.error as { message: string }).message
    }
  }

  return null
}

export function getAssistantErrorMessage(error: unknown, fallback: string) {
  const fromPayload = parseSpeechErrorPayload(
    (error as { response?: { data?: unknown } })?.response?.data
  )
  if (fromPayload) return fromPayload

  if (error instanceof Error && error.message) {
    // Axios uses this generic string for 4xx/5xx — prefer the API payload above.
    if (!/^Request failed with status code \d+$/.test(error.message)) {
      return error.message
    }
  }
  return fallback
}
