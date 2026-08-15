export const AI_PERSONALITIES = [
  "professional",
  "casual",
  "motivational",
] as const

export type AiPersonality = (typeof AI_PERSONALITIES)[number]

export const AI_DATA_SCOPES = ["tasks", "productivity", "all"] as const

export type AiDataScope = (typeof AI_DATA_SCOPES)[number]

export const DEFAULT_AI_PERSONALITY: AiPersonality = "professional"
export const DEFAULT_AI_VOICE_MODE = false
export const DEFAULT_AI_INSIGHTS = true
export const DEFAULT_AI_DATA_SCOPE: AiDataScope = "all"

export const AI_PERSONALITY_OPTIONS: { value: AiPersonality; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual & Friendly" },
  { value: "motivational", label: "Motivational Coach" },
]

export const AI_DATA_SCOPE_OPTIONS: { value: AiDataScope; label: string }[] = [
  { value: "tasks", label: "Tasks Only" },
  { value: "productivity", label: "Productivity Modules" },
  { value: "all", label: "All Modules" },
]

export function isAiPersonality(
  value: string | null | undefined
): value is AiPersonality {
  return !!value && (AI_PERSONALITIES as readonly string[]).includes(value)
}

export function isAiDataScope(
  value: string | null | undefined
): value is AiDataScope {
  return !!value && (AI_DATA_SCOPES as readonly string[]).includes(value)
}
