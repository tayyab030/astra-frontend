/** English Orpheus TTS voices used by Astra speech. */
export const AI_VOICES = [
  "austin",
  "daniel",
  "troy",
  "autumn",
  "diana",
  "hannah",
] as const

export type AiVoice = (typeof AI_VOICES)[number]

export const DEFAULT_AI_VOICE: AiVoice = "austin"

export const AI_VOICE_OPTIONS: { value: AiVoice; label: string }[] = [
  { value: "austin", label: "Austin (default)" },
  { value: "daniel", label: "Daniel" },
  { value: "troy", label: "Troy" },
  { value: "autumn", label: "Autumn" },
  { value: "diana", label: "Diana" },
  { value: "hannah", label: "Hannah" },
]

export function isAiVoice(value: string | null | undefined): value is AiVoice {
  return !!value && (AI_VOICES as readonly string[]).includes(value)
}
