"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getLocalDateString } from "@/app/app/health/_utils/date"
import { fetchHabits, fetchHabitsDay } from "@/lib/api/habits"
import { fetchGoalsDashboard } from "@/lib/api/goals"
import { fetchHealthDashboard } from "@/lib/api/health"
import { fetchNotesDashboard } from "@/lib/api/notes"
import { fetchProjects, fetchTasks } from "@/lib/api/tasks"
import { fetchWealthDashboard } from "@/lib/api/wealth"
import {
  isInQuietHours,
  loadNotificationSettings,
  normalizeNotificationSettings,
  saveNotificationSettings,
  shouldNotifyChannel,
  type NotificationSettings,
} from "@/lib/notification-settings"
import { collectCachedAiWarnings } from "@/lib/notifications/aiWarnings"
import { showPushNotification } from "@/lib/notifications/browserPush"
import { deriveAlerts } from "@/lib/notifications/deriveAlerts"
import {
  loadInboxState,
  pruneInboxState,
  saveInboxState,
  type InboxState,
} from "@/lib/notifications/inboxStorage"
import type { AppAlert } from "@/lib/notifications/types"
import {
  normalizeModuleSettings,
  type ModuleSettings,
} from "@/lib/module-settings"
import { useAppSelector } from "@/store/hooks"

const POLL_MS = 60_000
const MAX_PUSH_PER_TICK = 5

export type InboxAlert = AppAlert & {
  read: boolean
}

function startOfDayIso(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return d.toISOString()
}

function startOfWeekIso(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString()
}

function digestAllowsPush(
  settings: NotificationSettings,
  inbox: InboxState,
  now: Date
): boolean {
  if (settings.digest === "instant") return true
  if (settings.digest === "daily") {
    if (!inbox.lastDigestAt) return true
    return startOfDayIso(now) > startOfDayIso(new Date(inbox.lastDigestAt))
  }
  // weekly
  if (!inbox.lastDigestAt) return true
  return startOfWeekIso(now) > startOfWeekIso(new Date(inbox.lastDigestAt))
}

async function fetchNotificationBundle(today: string) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const lookback = new Date(now)
  lookback.setDate(lookback.getDate() - 7)
  const lookbackStart = getLocalDateString(lookback)

  const [
    overdueTasks,
    upcomingTasks,
    habitsList,
    habitsDay,
    notesDash,
    wealth,
    goals,
    projects,
    health,
  ] = await Promise.all([
    fetchTasks({ filter: "overdue" }).catch(() => ({ tasks: [], summary: null })),
    fetchTasks({ filter: "upcoming" }).catch(() => ({ tasks: [], summary: null })),
    fetchHabits().catch(() => []),
    fetchHabitsDay(today).catch(() => null),
    fetchNotesDashboard({
      has_reminder: true,
      page_size: 50,
      status: "active",
    }).catch(() => ({ notes: [] })),
    fetchWealthDashboard({ mode: "month", year, month }).catch(() => null),
    fetchGoalsDashboard({ mode: "month", year, month }).catch(() => null),
    fetchProjects().catch(() => []),
    fetchHealthDashboard({
      start_date: lookbackStart,
      end_date: today,
      today_date: today,
    }).catch(() => null),
  ])

  return {
    overdueTasks: overdueTasks.tasks ?? [],
    upcomingTasks: upcomingTasks.tasks ?? [],
    habitsList,
    habitsDay,
    notesWithReminders: (notesDash.notes ?? []).filter((n) => n.reminder),
    budgets: wealth?.category_budgets ?? [],
    goals: goals?.goals ?? [],
    projects: projects ?? [],
    healthToday: health
      ? {
          waterGlasses: health.today.waterGlasses,
          waterTarget: health.targets.waterGlasses,
          sleepHours: health.today.sleepHours,
          sleepTarget: health.targets.sleepHours,
          exerciseMinutes: health.today.exerciseMinutes,
          exerciseTarget: health.targets.exerciseMinutes,
        }
      : null,
  }
}

export function useAppNotifications() {
  const user = useAppSelector((s) => s.user.user)
  const userId = user?.id ?? ""
  const timezone = user?.timezone ?? "UTC"
  const moduleSettings: ModuleSettings = useMemo(
    () => normalizeModuleSettings(user?.module_settings),
    [user?.module_settings]
  )

  const [prefs, setPrefsState] = useState<NotificationSettings>(() =>
    normalizeNotificationSettings(null)
  )
  const [inbox, setInbox] = useState<InboxState>(() => ({
    readIds: [],
    dismissedIds: [],
    lastPushIds: [],
    lastDigestAt: null,
  }))
  const prefsHydrated = useRef(false)
  const pushTickRef = useRef(false)

  useEffect(() => {
    if (!userId) return
    setPrefsState(loadNotificationSettings(userId))
    setInbox(loadInboxState(userId))
    prefsHydrated.current = true

    const onSettings = (event: Event) => {
      const detail = (event as CustomEvent<{ userId: string; settings: NotificationSettings }>)
        .detail
      if (detail?.userId === userId && detail.settings) {
        setPrefsState(normalizeNotificationSettings(detail.settings))
      }
    }
    window.addEventListener("astra-notification-settings", onSettings)
    return () => window.removeEventListener("astra-notification-settings", onSettings)
  }, [userId])

  const setPrefs = useCallback(
    (next: NotificationSettings | ((prev: NotificationSettings) => NotificationSettings)) => {
      setPrefsState((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next
        const normalized = normalizeNotificationSettings(resolved)
        if (userId) saveNotificationSettings(userId, normalized)
        return normalized
      })
    },
    [userId]
  )

  const persistInbox = useCallback(
    (updater: (prev: InboxState) => InboxState) => {
      setInbox((prev) => {
        const next = updater(prev)
        if (userId) saveInboxState(userId, next)
        return next
      })
    },
    [userId]
  )

  const today = getLocalDateString()
  const queryEnabled = Boolean(userId)

  const { data: bundle, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["app-notifications", userId, today],
    enabled: queryEnabled,
    queryFn: () => fetchNotificationBundle(today),
    refetchInterval: (query) => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return false
      }
      return POLL_MS
    },
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  })

  const derivedAlerts = useMemo(() => {
    if (!bundle) return [] as AppAlert[]
    const now = new Date()
    return deriveAlerts({
      now,
      overdueTasks: bundle.overdueTasks,
      upcomingTasks: bundle.upcomingTasks,
      habitsList: bundle.habitsList,
      habitsDay: bundle.habitsDay,
      notesWithReminders: bundle.notesWithReminders,
      budgets: bundle.budgets,
      goals: bundle.goals,
      projects: bundle.projects,
      healthToday: bundle.healthToday,
      accountCreatedAt: user?.created_at ?? null,
      aiWarningMessages: userId ? collectCachedAiWarnings(userId) : [],
      modulesEnabled: moduleSettings.enabled,
      categoriesEnabled: prefs.categories,
    })
  }, [
    bundle,
    moduleSettings.enabled,
    prefs.categories,
    userId,
    user?.created_at,
    dataUpdatedAt,
  ])

  const visibleAlerts: InboxAlert[] = useMemo(() => {
    const dismissed = new Set(inbox.dismissedIds)
    const read = new Set(inbox.readIds)
    return derivedAlerts
      .filter((a) => !dismissed.has(a.id))
      .map((a) => ({ ...a, read: read.has(a.id) }))
  }, [derivedAlerts, inbox.dismissedIds, inbox.readIds])

  const inAppAlerts = useMemo(() => {
    if (!shouldNotifyChannel(prefs, "inApp")) return [] as InboxAlert[]
    return visibleAlerts
  }, [prefs, visibleAlerts])

  const unreadCount = useMemo(
    () => inAppAlerts.filter((a) => !a.read).length,
    [inAppAlerts]
  )

  // Prune + browser push
  const inboxRef = useRef(inbox)
  inboxRef.current = inbox

  useEffect(() => {
    if (!userId || !prefsHydrated.current || derivedAlerts.length === 0) return

    const activeIds = new Set(derivedAlerts.map((a) => a.id))
    const currentInbox = inboxRef.current
    const pruned = pruneInboxState(currentInbox, activeIds)
    if (
      pruned.readIds.length !== currentInbox.readIds.length ||
      pruned.dismissedIds.length !== currentInbox.dismissedIds.length ||
      pruned.lastPushIds.length !== currentInbox.lastPushIds.length
    ) {
      persistInbox(() => pruned)
    }

    if (!shouldNotifyChannel(prefs, "push")) return
    if (isInQuietHours(prefs, new Date(), timezone)) return
    if (!digestAllowsPush(prefs, currentInbox, new Date())) return
    if (pushTickRef.current) return

    const lastPushed = new Set(currentInbox.lastPushIds)
    const fresh = derivedAlerts.filter(
      (a) => !lastPushed.has(a.id) && !currentInbox.dismissedIds.includes(a.id)
    )
    if (fresh.length === 0) return

    pushTickRef.current = true
    const toPush =
      prefs.digest === "instant"
        ? fresh.slice(0, MAX_PUSH_PER_TICK)
        : [
            {
              ...fresh[0],
              title:
                prefs.digest === "daily"
                  ? `Daily digest · ${fresh.length} alert${fresh.length === 1 ? "" : "s"}`
                  : `Weekly digest · ${fresh.length} alert${fresh.length === 1 ? "" : "s"}`,
              body: fresh
                .slice(0, 3)
                .map((a) => a.title)
                .join(" · "),
              id: `digest:${startOfDayIso()}`,
            },
          ]

    for (const alert of toPush) {
      showPushNotification({
        title: alert.title,
        body: alert.body,
        href: alert.href,
        tag: alert.id,
      })
    }

    const pushedIds =
      prefs.digest === "instant" ? toPush.map((a) => a.id) : fresh.map((a) => a.id)

    persistInbox((prev) => ({
      ...prev,
      lastPushIds: [...new Set([...prev.lastPushIds, ...pushedIds])].slice(-200),
      lastDigestAt:
        prefs.digest === "instant" ? prev.lastDigestAt : new Date().toISOString(),
    }))

    const t = window.setTimeout(() => {
      pushTickRef.current = false
    }, 2000)
    return () => window.clearTimeout(t)
  }, [derivedAlerts, userId, prefs, timezone, persistInbox])

  const markRead = useCallback(
    (id: string) => {
      persistInbox((prev) =>
        prev.readIds.includes(id)
          ? prev
          : { ...prev, readIds: [...prev.readIds, id] }
      )
    },
    [persistInbox]
  )

  const markAllRead = useCallback(() => {
    const ids = inAppAlerts.map((a) => a.id)
    persistInbox((prev) => ({
      ...prev,
      readIds: [...new Set([...prev.readIds, ...ids])],
    }))
  }, [inAppAlerts, persistInbox])

  const dismiss = useCallback(
    (id: string) => {
      persistInbox((prev) => ({
        ...prev,
        dismissedIds: prev.dismissedIds.includes(id)
          ? prev.dismissedIds
          : [...prev.dismissedIds, id],
        readIds: prev.readIds.includes(id) ? prev.readIds : [...prev.readIds, id],
      }))
    },
    [persistInbox]
  )

  const dismissAll = useCallback(() => {
    const ids = inAppAlerts.map((a) => a.id)
    persistInbox((prev) => ({
      ...prev,
      dismissedIds: [...new Set([...prev.dismissedIds, ...ids])],
      readIds: [...new Set([...prev.readIds, ...ids])],
    }))
  }, [inAppAlerts, persistInbox])

  return {
    prefs,
    setPrefs,
    alerts: inAppAlerts,
    allAlerts: visibleAlerts,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    dismiss,
    dismissAll,
    refetch,
    inAppEnabled: shouldNotifyChannel(prefs, "inApp"),
  }
}
