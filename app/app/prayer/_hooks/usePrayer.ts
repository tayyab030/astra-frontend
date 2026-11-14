"use client"

import { useCallback, useEffect, useState } from "react"
import {
  FALLBACK_PRAYER_METHODS,
  fetchPrayerMethods,
  fetchPrayerPreferences,
  fetchPrayerTimings,
  updatePrayerPreferences,
  type PrayerCalculationMethod,
  type PrayerPreferences,
  type PrayerTimings,
} from "@/lib/api/prayer"
import { getUserErrorMessage } from "@/lib/api/user"
import {
  cancelBrowserAdhan,
  scheduleBrowserAdhan,
} from "@/lib/prayer/browserAdhan"
import {
  DEFAULT_ADHAN_KEYS,
  type TrackablePrayerKey,
} from "../_components/constants"
import { useBrowserLocation } from "./useBrowserLocation"

function normalizeAdhanKeys(keys: string[] | undefined | null): string[] {
  if (Array.isArray(keys) && keys.length > 0) return keys
  return [...DEFAULT_ADHAN_KEYS]
}

export function usePrayer() {
  const location = useBrowserLocation()
  const [methods, setMethods] = useState<PrayerCalculationMethod[]>(
    FALLBACK_PRAYER_METHODS
  )
  const [preferences, setPreferences] = useState<PrayerPreferences | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null)
  const [timings, setTimings] = useState<PrayerTimings | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isLoadingTimings, setIsLoadingTimings] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timingsTick, setTimingsTick] = useState(0)
  const [adhanEnabled, setAdhanEnabledState] = useState(false)
  const [adhanKeys, setAdhanKeys] = useState<string[]>([...DEFAULT_ADHAN_KEYS])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      setIsBootstrapping(true)
      setError(null)
      const [methodsResult, prefsResult] = await Promise.allSettled([
        fetchPrayerMethods(),
        fetchPrayerPreferences(),
      ])
      if (cancelled) return

      if (methodsResult.status === "fulfilled") {
        setMethods(
          methodsResult.value.length > 0
            ? methodsResult.value
            : FALLBACK_PRAYER_METHODS
        )
      } else {
        setMethods(FALLBACK_PRAYER_METHODS)
      }

      if (prefsResult.status === "fulfilled") {
        setPreferences(prefsResult.value)
        setSelectedMethod(prefsResult.value.method)
        setAdhanEnabledState(Boolean(prefsResult.value.adhan_enabled))
        setAdhanKeys(normalizeAdhanKeys(prefsResult.value.adhan_keys))
      } else {
        setError(
          getUserErrorMessage(
            prefsResult.reason,
            "Could not load prayer preferences."
          )
        )
      }

      setIsBootstrapping(false)
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadTimings() {
      if (
        selectedMethod == null ||
        location.latitude == null ||
        location.longitude == null ||
        location.isLoading
      ) {
        setTimings(null)
        setIsLoadingTimings(false)
        return
      }

      setIsLoadingTimings(true)
      setError(null)
      try {
        const result = await fetchPrayerTimings({
          latitude: location.latitude,
          longitude: location.longitude,
          method: selectedMethod,
          label: location.label ?? undefined,
        })
        if (cancelled) return
        setTimings(result)
        setPreferences((prev) => ({
          method: selectedMethod,
          method_name: result.method.name,
          latitude: location.latitude,
          longitude: location.longitude,
          location_label: location.label,
          adhan_enabled: prev?.adhan_enabled ?? false,
          adhan_keys: prev?.adhan_keys ?? [...DEFAULT_ADHAN_KEYS],
        }))
      } catch (err) {
        if (cancelled) return
        setTimings(null)
        setError(getUserErrorMessage(err, "Could not load prayer times."))
      } finally {
        if (!cancelled) setIsLoadingTimings(false)
      }
    }

    void loadTimings()
    return () => {
      cancelled = true
    }
  }, [
    selectedMethod,
    location.latitude,
    location.longitude,
    location.label,
    location.isLoading,
    timingsTick,
  ])

  useEffect(() => {
    if (!timings?.prayers?.length) {
      cancelBrowserAdhan()
      return
    }
    if (!adhanEnabled) {
      cancelBrowserAdhan()
      return
    }
    void scheduleBrowserAdhan(timings.prayers, adhanKeys)
    return () => {
      cancelBrowserAdhan()
    }
  }, [timings, adhanEnabled, adhanKeys])

  const selectMethod = useCallback(async (methodId: number) => {
    setSelectedMethod(methodId)
    try {
      const prefs = await updatePrayerPreferences({ method: methodId })
      setPreferences(prefs)
      setAdhanEnabledState(Boolean(prefs.adhan_enabled))
      setAdhanKeys(normalizeAdhanKeys(prefs.adhan_keys))
    } catch {
      // Timings request will still persist method + location.
    }
  }, [])

  const setAdhanEnabled = useCallback(
    async (enabled: boolean) => {
      setAdhanEnabledState(enabled)
      try {
        const prefs = await updatePrayerPreferences({
          adhan_enabled: enabled,
          adhan_keys: adhanKeys,
        })
        setPreferences(prefs)
        setAdhanEnabledState(Boolean(prefs.adhan_enabled))
        setAdhanKeys(normalizeAdhanKeys(prefs.adhan_keys))
      } catch {
        // keep optimistic
      }
    },
    [adhanKeys]
  )

  const toggleAdhanKey = useCallback(
    async (key: TrackablePrayerKey) => {
      const next = adhanKeys.includes(key)
        ? adhanKeys.filter((item) => item !== key)
        : [...adhanKeys, key]
      const safeNext = next.length > 0 ? next : [...DEFAULT_ADHAN_KEYS]
      setAdhanKeys(safeNext)
      try {
        const prefs = await updatePrayerPreferences({
          adhan_keys: safeNext,
          adhan_enabled: adhanEnabled,
        })
        setPreferences(prefs)
        setAdhanKeys(normalizeAdhanKeys(prefs.adhan_keys))
      } catch {
        // keep optimistic
      }
    },
    [adhanKeys, adhanEnabled]
  )

  const refreshTimings = useCallback(() => {
    setTimingsTick((value) => value + 1)
  }, [])

  return {
    methods,
    preferences,
    selectedMethod,
    timings,
    locationLabel: location.label,
    latitude: location.latitude,
    longitude: location.longitude,
    locationLoading: location.isLoading,
    locationError: location.error,
    permissionDenied: location.permissionDenied,
    isBootstrapping,
    isLoadingTimings,
    error,
    adhanEnabled,
    adhanKeys,
    selectMethod,
    setAdhanEnabled,
    toggleAdhanKey,
    refreshLocation: location.refresh,
    refreshTimings,
  }
}

export type UsePrayerState = ReturnType<typeof usePrayer>
