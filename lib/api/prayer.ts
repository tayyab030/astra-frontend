import { authApi } from "./simpleApi"
import { API_ENDPOINTS } from "./endpoints"

const { PRAYER } = API_ENDPOINTS

export type PrayerCalculationMethod = {
  id: number
  name: string
  region?: string
}

export type PrayerPreferences = {
  method: number | null
  method_name: string | null
  latitude: number | null
  longitude: number | null
  location_label: string | null
  adhan_enabled?: boolean
  adhan_keys?: string[]
}

export type PrayerTimingItem = {
  key: string
  name: string
  time: string
}

export type PrayerTimings = {
  date: {
    readable: string
    gregorian: string | null
    hijri: string | null
    weekday: string | null
  }
  location: {
    latitude: number | null
    longitude: number | null
    label: string | null
    city?: string | null
    country?: string | null
  }
  method: {
    id: number
    name: string
  }
  timezone: string | null
  timings: Record<string, string>
  prayers: PrayerTimingItem[]
}

export type PrayerOfferStatus = "on_time" | "qaza"

export type PrayerDayLog = {
  date: string
  completed: Record<string, boolean>
  statuses: Record<string, PrayerOfferStatus | null>
  trackable: string[]
}

export type PrayerLogsResponse = {
  days: Array<{
    date: string
    completed: Record<string, boolean>
    statuses: Record<string, PrayerOfferStatus | null>
  }>
}

/** Fallback if `/prayer/methods/` is unreachable so the dropdown is never blank. */
export const FALLBACK_PRAYER_METHODS: PrayerCalculationMethod[] = [
  { id: 0, name: "Shia Ithna-Ashari", region: "Shia" },
  {
    id: 1,
    name: "University of Islamic Sciences, Karachi",
    region: "Pakistan / South Asia",
  },
  {
    id: 2,
    name: "Islamic Society of North America (ISNA)",
    region: "North America",
  },
  { id: 3, name: "Muslim World League (MWL)", region: "Worldwide" },
  { id: 4, name: "Umm al-Qura, Makkah", region: "Saudi Arabia" },
  {
    id: 5,
    name: "Egyptian General Authority of Survey",
    region: "Egypt / Africa",
  },
  {
    id: 7,
    name: "Institute of Geophysics, University of Tehran",
    region: "Iran",
  },
  { id: 8, name: "Gulf Region", region: "Gulf" },
  { id: 9, name: "Kuwait", region: "Kuwait" },
  { id: 10, name: "Qatar", region: "Qatar" },
  {
    id: 11,
    name: "Majlis Ugama Islam Singapura, Singapore",
    region: "Singapore",
  },
  {
    id: 12,
    name: "Union Organization islamic de France",
    region: "France",
  },
  {
    id: 13,
    name: "Diyanet İşleri Başkanlığı, Turkey",
    region: "Turkey",
  },
  {
    id: 14,
    name: "Spiritual Administration of Muslims of Russia",
    region: "Russia",
  },
  { id: 15, name: "Moonsighting Committee Worldwide", region: "Worldwide" },
  { id: 16, name: "Dubai, UAE", region: "UAE" },
  {
    id: 17,
    name: "Jabatan Kemajuan Islam Malaysia (JAKIM)",
    region: "Malaysia",
  },
  { id: 18, name: "Tunisia", region: "Tunisia" },
  { id: 19, name: "Algeria", region: "Algeria" },
  {
    id: 20,
    name: "Kementerian Agama Republik Indonesia",
    region: "Indonesia",
  },
  { id: 21, name: "Morocco", region: "Morocco" },
  { id: 22, name: "Comunidade Islamica de Lisboa", region: "Portugal" },
  {
    id: 23,
    name: "Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan",
    region: "Jordan",
  },
]

export async function fetchPrayerMethods() {
  const response = await authApi.get<{ methods?: PrayerCalculationMethod[] }>(
    PRAYER.METHODS
  )
  const methods = response.data?.methods
  if (Array.isArray(methods) && methods.length > 0) return methods
  return FALLBACK_PRAYER_METHODS
}

export async function fetchPrayerPreferences() {
  const response = await authApi.get<PrayerPreferences>(PRAYER.PREFERENCES)
  return response.data
}

export async function updatePrayerPreferences(payload: {
  method?: number | null
  latitude?: number | null
  longitude?: number | null
  location_label?: string | null
  adhan_enabled?: boolean
  adhan_keys?: string[]
}) {
  const response = await authApi.patch<PrayerPreferences>(
    PRAYER.PREFERENCES,
    payload
  )
  return response.data
}

export async function fetchPrayerTimings(params: {
  latitude: number
  longitude: number
  method: number
  label?: string
  date?: string
}) {
  const response = await authApi.get<PrayerTimings>(PRAYER.TIMINGS, {
    params: {
      latitude: params.latitude,
      longitude: params.longitude,
      method: params.method,
      label: params.label,
      date: params.date,
    },
  })
  return response.data
}

export async function fetchPrayerDay(date: string) {
  const response = await authApi.get<PrayerDayLog>(PRAYER.DAY, {
    params: { date },
  })
  return response.data
}

export async function updatePrayerDay(payload: {
  date: string
  prayer_key: string
  completed: boolean
  status?: PrayerOfferStatus
}) {
  const response = await authApi.patch<PrayerDayLog>(PRAYER.DAY, payload)
  return response.data
}

export async function fetchPrayerLogs(from: string, to: string) {
  const response = await authApi.get<PrayerLogsResponse>(PRAYER.LOGS, {
    params: { from, to },
  })
  return response.data
}
