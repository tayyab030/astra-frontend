"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck, Trash2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/constants/routes"
import { useAppNotifications } from "@/hooks/useAppNotifications"
import { cn } from "@/lib/utils"
import type { AlertSeverity } from "@/lib/notifications/types"

function severityClass(severity: AlertSeverity) {
  if (severity === "critical") return "bg-destructive/15 text-destructive"
  if (severity === "warning") return "bg-amber-500/15 text-amber-600 dark:text-amber-400"
  return "bg-primary/10 text-primary"
}

export function NotificationBell() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const {
    alerts,
    unreadCount,
    markRead,
    markAllRead,
    dismiss,
    dismissAll,
    inAppEnabled,
    isLoading,
  } = useAppNotifications()

  const badgeLabel = useMemo(() => {
    if (unreadCount <= 0) return null
    return unreadCount > 99 ? "99+" : String(unreadCount)
  }, [unreadCount])

  if (!inAppEnabled) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        asChild
        aria-label="Alerts disabled — open settings"
      >
        <Link href={`${ROUTES.APP.SETTINGS}?tab=notifications`}>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </Link>
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} unread alerts`
              : "Notifications"
          }
        >
          <Bell className="h-4 w-4" />
          {badgeLabel ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {badgeLabel}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(100vw-2rem,22rem)] p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <div>
            <p className="font-mono text-sm font-semibold text-foreground">Alerts</p>
            <p className="text-xs text-muted-foreground font-mono">
              {isLoading ? "Refreshing…" : `${unreadCount} unread`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={alerts.length === 0 || unreadCount === 0}
              onClick={() => markAllRead()}
              aria-label="Mark all read"
              title="Mark all read"
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={alerts.length === 0}
              onClick={() => dismissAll()}
              aria-label="Dismiss all"
              title="Dismiss all"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[min(60vh,22rem)]">
          {alerts.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="font-mono text-sm text-muted-foreground">You&apos;re all caught up</p>
              <Link
                href={`${ROUTES.APP.SETTINGS}?tab=notifications`}
                className="mt-2 inline-block font-mono text-xs text-primary hover:underline"
                onClick={() => setOpen(false)}
              >
                Manage alert preferences
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {alerts.map((alert) => (
                <li key={alert.id} className={cn(!alert.read && "bg-primary/5")}>
                  <div className="flex gap-2 px-3 py-2.5">
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        markRead(alert.id)
                        setOpen(false)
                        router.push(alert.href)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "h-5 px-1.5 font-mono text-[10px] font-normal",
                            severityClass(alert.severity)
                          )}
                        >
                          {alert.severity}
                        </Badge>
                        {!alert.read ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        ) : null}
                      </div>
                      <p className="mt-1 font-mono text-sm font-medium text-foreground line-clamp-1">
                        {alert.title}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground line-clamp-2">
                        {alert.body}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(alert.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => dismiss(alert.id)}
                      aria-label="Dismiss"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <Separator />
        <div className="px-3 py-2">
          <Link
            href={`${ROUTES.APP.SETTINGS}?tab=notifications`}
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            Open Alerts settings
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
