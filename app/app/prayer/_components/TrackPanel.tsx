"use client"

import { useEffect, useMemo, useState } from "react"
import { addDays, format, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getPrayerTrackGate,
  type PrayerOfferStatus,
} from "@/lib/prayer/trackGate"
import { getLocalDateString } from "../../health/_utils/date"
import { usePrayerDay } from "../_hooks/usePrayerDay"
import type { UsePrayerState } from "../_hooks/usePrayer"
import {
  TRACKABLE_PRAYER_KEYS,
  TRACKABLE_PRAYER_LABELS,
  type TrackablePrayerKey,
} from "./constants"

function statusLabel(status: PrayerOfferStatus | null | undefined) {
  if (status === "on_time") return "On time"
  if (status === "qaza") return "Qaza"
  return null
}

export function TrackPanel({ prayer }: { prayer: UsePrayerState }) {
  const today = getLocalDateString()
  const [date, setDate] = useState(today)
  const [now, setNow] = useState(() => new Date())
  const [statusPromptKey, setStatusPromptKey] =
    useState<TrackablePrayerKey | null>(null)
  const { day, isLoading, isSaving, error, togglePrayer } = usePrayerDay(date)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const times = prayer.timings?.timings ?? {}

  const relative = useMemo(() => {
    if (date === today) return "Today"
    if (date === format(addDays(parseISO(today), -1), "yyyy-MM-dd")) {
      return "Yesterday"
    }
    return format(parseISO(date), "EEE")
  }, [date, today])

  const isFuture = date > today
  const canGoNext = date < today

  const completedCount = useMemo(() => {
    if (!day) return 0
    return TRACKABLE_PRAYER_KEYS.filter((key) => day.completed[key]).length
  }, [day])

  const shift = (amount: number) => {
    const next = format(addDays(parseISO(date), amount), "yyyy-MM-dd")
    if (next > today) return
    setDate(next)
  }

  const handleToggle = (key: TrackablePrayerKey, checked: boolean) => {
    if (isFuture || isSaving) return

    const gate = getPrayerTrackGate({
      prayerKey: key,
      date,
      today,
      now,
      times,
    })
    if (gate.kind !== "open") return

    if (!checked) {
      void togglePrayer(key, false)
      return
    }

    if (!gate.needsStatusPrompt) {
      void togglePrayer(key, true, "on_time")
      return
    }

    setStatusPromptKey(key)
  }

  const confirmStatus = (status: PrayerOfferStatus) => {
    if (!statusPromptKey) return
    const key = statusPromptKey
    setStatusPromptKey(null)
    void togglePrayer(key, true, status)
  }

  return (
    <div className="space-y-6">
      <Card className="astra-card">
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => shift(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[9.5rem] text-center">
              <p className="text-sm font-medium text-foreground">{relative}</p>
              <p className="text-xs text-muted-foreground">
                {format(parseISO(date), "MMM d, yyyy")}
              </p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={!canGoNext}
              onClick={() => shift(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={
                date === format(addDays(parseISO(today), -1), "yyyy-MM-dd")
                  ? "default"
                  : "outline"
              }
              className={
                date === format(addDays(parseISO(today), -1), "yyyy-MM-dd")
                  ? "astra-btn-primary"
                  : ""
              }
              onClick={() =>
                setDate(format(addDays(parseISO(today), -1), "yyyy-MM-dd"))
              }
            >
              Yesterday
            </Button>
            <Button
              type="button"
              size="sm"
              variant={date === today ? "default" : "outline"}
              className={date === today ? "astra-btn-primary" : ""}
              onClick={() => setDate(today)}
            >
              Today
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="astra-card">
        <CardContent className="flex items-start justify-between gap-4 pt-6">
          <div className="space-y-1">
            <Label className="text-foreground">Adhan notifications</Label>
            <p className="text-sm text-muted-foreground">
              Same toggle as Times — alerts while this tab stays open
            </p>
          </div>
          <Switch
            checked={prayer.adhanEnabled}
            onCheckedChange={(checked) => {
              void prayer.setAdhanEnabled(checked)
            }}
          />
        </CardContent>
      </Card>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="text-primary">Mark completed</CardTitle>
          <CardDescription>
            {isFuture
              ? "Future days are locked — you can only track today or past days."
              : `Tahajjud + Fajr–Isha · ${completedCount}/${TRACKABLE_PRAYER_KEYS.length} done`}
            {isSaving ? " · saving…" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && !day ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            TRACKABLE_PRAYER_KEYS.map((key) => {
              const done = Boolean(day?.completed[key])
              const status = day?.statuses?.[key] ?? null
              const badge = done ? statusLabel(status) : null
              const gate = isFuture
                ? ({ kind: "locked_future", reason: "Future day" } as const)
                : getPrayerTrackGate({
                    prayerKey: key,
                    date,
                    today,
                    now,
                    times,
                  })
              const locked = gate.kind !== "open"
              const reason =
                gate.kind === "locked_future" || gate.kind === "locked_closed"
                  ? gate.reason
                  : null

              return (
                <label
                  key={key}
                  className={`flex items-center justify-between gap-3 rounded-lg border border-border/50 astra-panel px-4 py-3 ${
                    locked
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {TRACKABLE_PRAYER_LABELS[key]}
                      </span>
                      {badge ? (
                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            status === "qaza"
                              ? "bg-secondary text-muted-foreground"
                              : "bg-primary/15 text-primary"
                          }`}
                        >
                          {badge}
                        </span>
                      ) : null}
                    </div>
                    {reason ? (
                      <p className="text-xs text-muted-foreground">{reason}</p>
                    ) : null}
                  </div>
                  <Checkbox
                    checked={done}
                    disabled={locked || isSaving}
                    onCheckedChange={(checked) => {
                      handleToggle(key, checked === true)
                    }}
                  />
                </label>
              )
            })
          )}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>

      <AlertDialog
        open={statusPromptKey != null}
        onOpenChange={(open) => {
          if (!open) setStatusPromptKey(null)
        }}
      >
        <AlertDialogContent className="astra-card">
          <AlertDialogHeader>
            <AlertDialogTitle>How was this prayer offered?</AlertDialogTitle>
            <AlertDialogDescription>
              {statusPromptKey
                ? `Was ${TRACKABLE_PRAYER_LABELS[statusPromptKey]} offered on time or as qaza?`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => confirmStatus("qaza")}
            >
              Qaza
            </Button>
            <Button
              type="button"
              className="astra-btn-primary"
              disabled={isSaving}
              onClick={() => confirmStatus("on_time")}
            >
              On time
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
