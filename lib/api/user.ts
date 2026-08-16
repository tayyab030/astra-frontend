import { authApi, publicApi } from "./simpleApi"
import { API_ENDPOINTS } from "./endpoints"
import type { AppTheme } from "@/lib/theme"
import type { AiVoice } from "@/lib/ai-voice"
import type { AiDataScope, AiPersonality } from "@/lib/ai-settings"
import type { AiLanguage } from "@/lib/ai-language"
import type { ModuleSettings } from "@/lib/module-settings"

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
  module_settings?: ModuleSettings
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
  module_settings?: Partial<ModuleSettings> & {
    weights?: Partial<ModuleSettings["weights"]>
    enabled?: Partial<ModuleSettings["enabled"]>
  }
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

export async function requestAccountDeletion() {
  const response = await authApi.post<{
    message: string
    sent: boolean
    remaining_time_seconds?: number
    email?: string
  }>(AUTH.REQUEST_DELETE_ACCOUNT)
  return response.data
}

/** Settings → Change Password (same TEMPORARY_EMAIL_FLOW as public forgot). */
export async function requestPasswordResetForCurrentUser() {
  const response = await authApi.post<{
    message: string
    sent: boolean
    reset_token?: string
    remaining_time_seconds?: number
  }>(AUTH.FORGOT_PASSWORD_AUTHED)
  return response.data
}

export async function fetchAccountDeleteStatus(token: string) {
  const response = await publicApi.get<{
    email: string
    remaining_time_seconds: number
  }>(AUTH.ACCOUNT_DELETE_STATUS(token))
  return response.data
}

export async function confirmAccountDeletion(token: string) {
  const response = await publicApi.post<{
    message: string
    email: string
  }>(AUTH.CONFIRM_DELETE_ACCOUNT, { token })
  return response.data
}
