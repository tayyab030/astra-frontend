import {
  BarChart3,
  CheckSquare,
  Clock,
  type LucideIcon,
} from "lucide-react"

export type PrayerTabId = "times" | "track" | "analysis"

export const PRAYER_TABS = [
  { id: "times", label: "Times", icon: Clock },
  { id: "track", label: "Track", icon: CheckSquare },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
] as const satisfies readonly {
  id: PrayerTabId
  label: string
  icon: LucideIcon
}[]

export const TRACKABLE_PRAYER_KEYS = [
  "Lastthird",
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
] as const

export type TrackablePrayerKey = (typeof TRACKABLE_PRAYER_KEYS)[number]

export const TRACKABLE_PRAYER_LABELS: Record<TrackablePrayerKey, string> = {
  Fajr: "Fajr",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
  Lastthird: "Tahajjud",
}

export const DEFAULT_ADHAN_KEYS: TrackablePrayerKey[] = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
]
