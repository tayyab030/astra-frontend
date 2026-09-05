"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  CloudMoon,
  LocateFixed,
  MapPin,
  Moon,
  RefreshCw,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Timer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  formatCountdown,
  formatCountdownShort,
  getCurrentPrayerWindow,
  nextPrayerIndex,
  remainingForPrayer,
} from "@/lib/prayer/countdown"
import { buildDisplayPrayers } from "@/lib/prayer/buildDisplayPrayers"
import { cn } from "@/lib/utils"
import type { UsePrayerState } from "../_hooks/usePrayer"
import {
  DEFAULT_ADHAN_KEYS,
  TRACKABLE_PRAYER_KEYS,
  TRACKABLE_PRAYER_LABELS,
  type TrackablePrayerKey,
} from "./constants"

const PRAYER_ICONS: Record<string, typeof Moon> = {
  Fajr: Moon,
  Sunrise: Sunrise,
  Dhuhr: Sun,
  Asr: CloudMoon,
  Sunset: Sunset,
  Maghrib: Sunset,
  Isha: Moon,
  Imsak: Timer,
  Midnight: Moon,
  Firstthird: Moon,
  Lastthird: Sparkles,
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

export function TimesPanel({ prayer }: { prayer: UsePrayerState }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
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

  const methodDropdown = (
    <Card className="astra-card">
      <CardContent className="space-y-3 pt-6">
        <Label htmlFor="prayer-method" className="text-muted-foreground">
          Calculation method
        </Label>
        <Select
          value={
            prayer.selectedMethod != null
              ? String(prayer.selectedMethod)
              : undefined
          }
          onValueChange={(value) => {
            void prayer.selectMethod(Number(value))
          }}
        >
          <SelectTrigger
            id="prayer-method"
            className="bg-secondary/60 border-border text-foreground w-full sm:max-w-md"
          >
            <SelectValue placeholder="Select a method" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border max-h-72">
            {prayer.methods.map((method) => (
              <SelectItem key={method.id} value={String(method.id)}>
                {method.region
                  ? `${method.name} (${method.region})`
                  : method.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {prayer.selectedMethod == null ? (
          <p className="text-sm text-muted-foreground">
            Select a method first. Prayer times use your browser location the
            same way the mobile app uses device GPS.
          </p>
        ) : null}
        {prayer.error && prayer.selectedMethod == null ? (
          <p className="text-sm text-destructive">{prayer.error}</p>
        ) : null}
      </CardContent>
    </Card>
  )

  const adhanCard = (
    <Card className="astra-card">
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Label className="text-foreground">Adhan notifications</Label>
            <p className="text-sm text-muted-foreground">
              Enable Adhan notifications for selected prayers while this page is
              open. Closed-tab alerts need a service worker later.
            </p>
          </div>
          <Switch
            checked={prayer.adhanEnabled}
            onCheckedChange={(checked) => {
              void prayer.setAdhanEnabled(checked)
            }}
          />
        </div>
        {prayer.adhanEnabled ? (
          <div className="flex flex-wrap gap-2">
            {TRACKABLE_PRAYER_KEYS.map((key) => {
              const on = prayer.adhanKeys.includes(key)
              return (
                <Button
                  key={key}
                  type="button"
                  size="sm"
                  variant={on ? "default" : "outline"}
                  className={on ? "astra-btn-primary" : ""}
                  onClick={() => {
                    void prayer.toggleAdhanKey(key as TrackablePrayerKey)
                  }}
                >
                  {TRACKABLE_PRAYER_LABELS[key]}
                </Button>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Default alerts: {DEFAULT_ADHAN_KEYS.join(", ")}. Tahajjud optional.
          </p>
        )}
      </CardContent>
    </Card>
  )

  if (prayer.selectedMethod == null) {
    return (
      <div className="space-y-6">
        {methodDropdown}
        {adhanCard}
      </div>
    )
  }

  if (prayer.locationLoading) {
    return (
      <div className="space-y-6">
        {methodDropdown}
        {adhanCard}
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3">
          <LocateFixed className="h-6 w-6 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">Finding your location…</p>
        </div>
      </div>
    )
  }

  if (
    prayer.latitude == null ||
    prayer.longitude == null ||
    prayer.permissionDenied
  ) {
    return (
      <div className="space-y-6">
        {methodDropdown}
        {adhanCard}
        <Card className="astra-card">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <MapPin className="h-8 w-8 text-primary" />
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-primary">
                Location needed
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                {prayer.locationError ??
                  "Allow location access so Astra can load prayer times for where you are."}
              </p>
            </div>
            <Button onClick={prayer.refreshLocation}>Try again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (prayer.isLoadingTimings && !prayer.timings) {
    return (
      <div className="space-y-6">
        {methodDropdown}
        {adhanCard}
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading prayer times…</p>
        </div>
      </div>
    )
  }

  if (prayer.error && !prayer.timings) {
    return (
      <div className="space-y-6">
        {methodDropdown}
        {adhanCard}
        <Card className="astra-card">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{prayer.error}</p>
            <Button onClick={prayer.refreshTimings}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const timings = prayer.timings

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prayer.refreshLocation}
          className="max-w-full"
        >
          <MapPin className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">
            {prayer.locationLabel ?? "Refresh location"}
          </span>
        </Button>
        <Button variant="outline" size="sm" onClick={prayer.refreshTimings}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {methodDropdown}
      {adhanCard}

      {currentWindow ? (
        <Card className="astra-card overflow-hidden">
          <CardContent className="relative py-6">
            <div className="space-y-1.5">
              <Badge
                variant="outline"
                className="border-border text-muted-foreground"
              >
                Current prayer
              </Badge>
              <h2 className="text-2xl font-semibold text-primary">
                {currentWindow.prayer.name}
              </h2>
              <p className="text-2xl font-bold tracking-tight text-white light:text-foreground">
                {formatClock(currentWindow.prayer.time)}
              </p>
              <p className="text-base font-semibold text-primary">
                {formatCountdown(currentWindow.remainingMs)} left
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {nextPrayer ? (
        <Card className="astra-card overflow-hidden">
          <CardContent className="relative py-8">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="border-primary/40 text-primary"
              >
                Next prayer
              </Badge>
              <h2 className="text-3xl font-semibold text-primary">
                {nextPrayer.name}
              </h2>
              <p className="text-4xl font-bold tracking-tight text-white light:text-foreground">
                {formatClock(nextPrayer.time)}
              </p>
              {nextMs != null ? (
                <p className="text-lg font-semibold text-primary">
                  in {formatCountdown(nextMs)}
                </p>
              ) : null}
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {prayer.locationLabel ??
                  timings?.location.label ??
                  "Current location"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="text-primary">All prayers today</CardTitle>
          <CardDescription>
            Fajr through Isha, plus Imsak, Midnight, First Third, and Tahajjud
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {prayers.map((item, index) => {
            const Icon = PRAYER_ICONS[item.key] ?? Moon
            const isNext = index === nextIndex
            const remainingMs = remainingForPrayer(
              prayers,
              index,
              nextIndex,
              now
            )
            return (
              <div
                key={item.key}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-4 py-3",
                  isNext
                    ? "border-primary/40 bg-primary/10"
                    : "border-border/50 astra-panel"
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isNext ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <div className="min-w-0">
                    <div
                      className={cn(
                        "font-medium",
                        isNext ? "text-primary" : "text-foreground"
                      )}
                    >
                      {item.name}
                    </div>
                    <div
                      className={cn(
                        "text-xs",
                        isNext ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {remainingMs != null
                        ? isNext
                          ? `in ${formatCountdown(remainingMs)}`
                          : `in ${formatCountdownShort(remainingMs)}`
                        : "Passed"}
                    </div>
                  </div>
                </div>
                <span className="text-lg font-semibold tabular-nums text-white light:text-foreground">
                  {formatClock(item.time)}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
