"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Moon } from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ROUTES } from "@/constants/routes"
import { buildDisplayPrayers } from "@/lib/prayer/buildDisplayPrayers"
import {
  formatCountdownShort,
  getCurrentPrayerWindow,
  nextPrayerIndex,
  remainingForPrayer,
} from "@/lib/prayer/countdown"
import { TRACKABLE_PRAYER_KEYS } from "@/app/app/prayer/_components/constants"
import { usePrayer } from "@/app/app/prayer/_hooks/usePrayer"
import { usePrayerDay } from "@/app/app/prayer/_hooks/usePrayerDay"
import { cn } from "@/lib/utils"

function todayIsoDate() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function formatClock(time: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim())
  if (!match) return time
  let hours = Number(match[1])
  const minutes = match[2]
  const suffix = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${suffix}`
}

export function PrayerWidget() {
  const prayer = usePrayer()
  const { day, isLoading: dayLoading } = usePrayerDay(todayIsoDate())
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const prayers = useMemo(
    () =>
      buildDisplayPrayers({
        prayers: prayer.timings?.prayers,
        timings: prayer.timings?.timings,
      }),
    [prayer.timings]
  )

  const nextIndex = useMemo(
    () => (prayers.length ? nextPrayerIndex(prayers, now) : -1),
    [prayers, now]
  )
  const nextPrayer = nextIndex >= 0 ? prayers[nextIndex] : null
  const nextMs =
    nextIndex >= 0
      ? remainingForPrayer(prayers, nextIndex, nextIndex, now)
      : null
  const currentWindow =
    nextIndex >= 0 ? getCurrentPrayerWindow(prayers, nextIndex, now) : null

  const completedCount = TRACKABLE_PRAYER_KEYS.filter(
    (key) => day?.completed?.[key]
  ).length
  const totalTrackable = TRACKABLE_PRAYER_KEYS.length

  const isLoading =
    prayer.isBootstrapping ||
    prayer.isLoadingTimings ||
    (dayLoading && !day) ||
    prayer.locationLoading

  const needsSetup =
    !isLoading &&
    (prayer.selectedMethod == null ||
      prayer.permissionDenied ||
      (!prayer.timings && !prayer.error))

  return (
    <Link href={`${ROUTES.APP.PRAYER}?tab=times`} className="block">
      <Card className="astra-card transition-colors hover:border-primary/40">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Moon className="h-4 w-4" />
              <span className="font-semibold">Prayer</span>
            </div>
            {!needsSetup && !isLoading ? (
              <span className="text-sm text-muted-foreground">
                Today {completedCount}/{totalTrackable}
              </span>
            ) : null}
          </div>

          {!needsSetup && !isLoading ? (
            <div className="flex items-center gap-1.5">
              {TRACKABLE_PRAYER_KEYS.map((key) => {
                const done = Boolean(day?.completed?.[key])
                return (
                  <span
                    key={key}
                    className={cn(
                      "h-2 w-2 rounded-full border",
                      done
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40 bg-transparent"
                    )}
                    aria-hidden
                  />
                )
              })}
            </div>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading prayer times…</p>
          ) : needsSetup ? (
            <p className="text-sm text-muted-foreground">
              {prayer.permissionDenied
                ? "Enable location to see prayer times"
                : "Click to set up today's prayer times"}
            </p>
          ) : prayer.error && !nextPrayer ? (
            <p className="text-sm text-muted-foreground">{prayer.error}</p>
          ) : (
            <div className="space-y-1.5">
              {currentWindow ? (
                <p className="text-2xl font-bold text-primary leading-tight">
                  {currentWindow.prayer.name}
                </p>
              ) : null}
              {nextPrayer ? (
                <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <span>{currentWindow ? "Next" : "Up next"}</span>
                  <span className="font-medium text-foreground">
                    {nextPrayer.name}
                  </span>
                  <span>· {formatClock(nextPrayer.time)}</span>
                  {nextMs != null ? (
                    <span className="font-medium text-primary">
                      · {formatCountdownShort(nextMs)}
                    </span>
                  ) : null}
                </p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
