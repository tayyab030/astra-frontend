import { authApi } from "./simpleApi"
import { API_ENDPOINTS } from "./endpoints"
import type { AppTheme } from "@/lib/theme"
import type { AiVoice } from "@/lib/ai-voice"
import type { AiDataScope, AiPersonality } from "@/lib/ai-settings"
import type { AiLanguage } from "@/lib/ai-language"

const { AUTH } = API_ENDPOINTS

export interface AuthUser {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  gender: "male" | "female" | "other" | "prefer_not_to_say" | null
  currency: string
  country: string | null
  timezone: string
  theme: AppTheme
  ai_voice: AiVoice
  ai_voice_mode: boolean
  ai_personality: AiPersonality
  ai_insights: boolean
  ai_data_scope: AiDataScope
  ai_language: AiLanguage
}

export interface UpdateProfilePayload {
  first_name?: string
  last_name?: string
  gender?: "male" | "female" | "other" | "prefer_not_to_say"
  currency?: string
  timezone?: string
  theme?: AppTheme
  ai_voice?: AiVoice
  ai_voice_mode?: boolean
  ai_personality?: AiPersonality
  ai_insights?: boolean
  ai_data_scope?: AiDataScope
  ai_language?: AiLanguage
}

export function getUserErrorMessage(error: unknown, fallback: string) {
  const responseData = (error as { response?: { data?: Record<string, unknown> } })?.response
    ?.data

  if (!responseData) return fallback

  if (typeof responseData.detail === "string") return responseData.detail
  if (typeof responseData.message === "string") return responseData.message

  const firstFieldError = Object.values(responseData).find(
    (value) => Array.isArray(value) && typeof value[0] === "string"
  ) as string[] | undefined

  return firstFieldError?.[0] ?? fallback
}

export async function fetchCurrentUser() {
  const response = await authApi.get<AuthUser>(AUTH.ME)
  return response.data
}

export async function updateCurrentUser(payload: UpdateProfilePayload) {
  const response = await authApi.patch<AuthUser>(AUTH.ME, payload)
  return response.data
}
