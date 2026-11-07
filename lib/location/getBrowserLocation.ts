/**
 * Browser geolocation + reverse geocode for Prayer / location UI.
 * Matches mobile label shape: "City, Region, Country" with coords fallback.
 *
 * Desktop browsers often misplace Pakistan (and nearby) users into India via
 * Wi‑Fi/IP location databases. When GPS country conflicts with IP country, we
 * trust IP (and the browser timezone as a tie-break).
 */

export type BrowserLocationPayload = {
  label: string
  latitude: number
  longitude: number
}

type ResolvedLocation = BrowserLocationPayload & {
  countryCode: string | null
}

function formatCoords(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`
}

function formatAddress(parts: Array<string | null | undefined>) {
  const unique = parts.filter(
    (part, index, arr): part is string =>
      Boolean(part) && arr.indexOf(part) === index
  )
  return unique.length > 0 ? unique.join(", ") : null
}

function browserTimezoneCountryHint(): string | null {
  if (typeof Intl === "undefined") return null
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (timezone === "Asia/Karachi") return "PK"
  if (timezone === "Asia/Kolkata" || timezone === "Asia/Calcutta") return "IN"
  return null
}

async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ label: string; countryCode: string | null } | null> {
  try {
    const url = new URL(
      "https://api.bigdatacloud.net/data/reverse-geocode-client"
    )
    url.searchParams.set("latitude", String(latitude))
    url.searchParams.set("longitude", String(longitude))
    url.searchParams.set("localityLanguage", "en")

    const response = await fetch(url.toString())
    if (!response.ok) return null

    const data = (await response.json()) as {
      city?: string
      locality?: string
      principalSubdivision?: string
      countryName?: string
      countryCode?: string
    }

    const label = formatAddress([
      data.city || data.locality,
      data.principalSubdivision,
      data.countryName,
    ])
    if (!label) return null

    return {
      label,
      countryCode: data.countryCode?.toUpperCase() ?? null,
    }
  } catch {
    return null
  }
}

async function fetchIpLocation(): Promise<ResolvedLocation | null> {
  const endpoints = [
    {
      url: "https://get.geojs.io/v1/ip/geo.json",
      parse: (data: Record<string, unknown>): ResolvedLocation | null => {
        const latitude = Number(data.latitude)
        const longitude = Number(data.longitude)
        const countryCode =
          typeof data.country_code === "string"
            ? data.country_code.toUpperCase()
            : null
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null
        }
        const label =
          formatAddress([
            typeof data.city === "string" ? data.city : null,
            typeof data.region === "string" ? data.region : null,
            typeof data.country === "string" ? data.country : null,
          ]) ?? formatCoords(latitude, longitude)
        return { label, latitude, longitude, countryCode }
      },
    },
    {
      url: "https://ipwho.is/",
      parse: (data: Record<string, unknown>): ResolvedLocation | null => {
        if (data.success === false) return null
        const latitude = Number(data.latitude)
        const longitude = Number(data.longitude)
        const countryCode =
          typeof data.country_code === "string"
            ? data.country_code.toUpperCase()
            : null
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null
        }
        const label =
          formatAddress([
            typeof data.city === "string" ? data.city : null,
            typeof data.region === "string" ? data.region : null,
            typeof data.country === "string" ? data.country : null,
          ]) ?? formatCoords(latitude, longitude)
        return { label, latitude, longitude, countryCode }
      },
    },
  ]

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url)
      if (!response.ok) continue
      const data = (await response.json()) as Record<string, unknown>
      const parsed = endpoint.parse(data)
      if (parsed) return parsed
    } catch {
      // Try the next provider.
    }
  }

  return null
}

function readPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Location is not supported in this browser"))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      // Prefer GPS over Wi‑Fi/IP. Network location often misplaces
      // Pakistan (and nearby) users into India in browser databases.
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    })
  })
}

async function readGpsLocation(): Promise<ResolvedLocation | null> {
  try {
    const position = await readPosition()
    const { latitude, longitude } = position.coords
    const geo = await reverseGeocode(latitude, longitude)
    return {
      latitude,
      longitude,
      label: geo?.label ?? formatCoords(latitude, longitude),
      countryCode: geo?.countryCode ?? null,
    }
  } catch {
    return null
  }
}

function preferIpOverGps(gps: ResolvedLocation, ip: ResolvedLocation): boolean {
  const gpsCountry = gps.countryCode
  const ipCountry = ip.countryCode
  if (gpsCountry && ipCountry && gpsCountry !== ipCountry) {
    return true
  }

  const tzCountry = browserTimezoneCountryHint()
  if (tzCountry && gpsCountry && gpsCountry !== tzCountry) {
    return true
  }

  return false
}

/**
 * Reads browser GPS and reverse-geocodes to a human label (same idea as mobile Expo).
 * Falls back to IP geolocation when GPS is denied or clearly wrong (country mismatch).
 */
export async function getBrowserLocationPayload(): Promise<BrowserLocationPayload | null> {
  const [gps, ip] = await Promise.all([readGpsLocation(), fetchIpLocation()])

  if (gps && ip && preferIpOverGps(gps, ip)) {
    return {
      label: ip.label,
      latitude: ip.latitude,
      longitude: ip.longitude,
    }
  }

  const chosen = gps ?? ip
  if (!chosen) return null

  return {
    label: chosen.label,
    latitude: chosen.latitude,
    longitude: chosen.longitude,
  }
}
