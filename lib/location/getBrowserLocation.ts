/**
 * Browser geolocation + reverse geocode for Prayer / location UI.
 * Matches mobile label shape: "City, Region, Country" with coords fallback.
 */

export type BrowserLocationPayload = {
  label: string
  latitude: number
  longitude: number
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

async function reverseGeocodeLabel(
  latitude: number,
  longitude: number
): Promise<string | null> {
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
    }

    return formatAddress([
      data.city || data.locality,
      data.principalSubdivision,
      data.countryName,
    ])
  } catch {
    return null
  }
}

function readPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Location is not supported in this browser"))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 60000,
    })
  })
}

/**
 * Reads browser GPS and reverse-geocodes to a human label (same idea as mobile Expo).
 * Returns null when permission is denied or location cannot be read.
 */
export async function getBrowserLocationPayload(): Promise<BrowserLocationPayload | null> {
  try {
    const position = await readPosition()
    const { latitude, longitude } = position.coords
    let label = formatCoords(latitude, longitude)

    const formatted = await reverseGeocodeLabel(latitude, longitude)
    if (formatted) label = formatted

    return { label, latitude, longitude }
  } catch {
    return null
  }
}
