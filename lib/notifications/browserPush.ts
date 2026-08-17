export async function requestPushPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied"
  }
  if (Notification.permission === "granted") return "granted"
  if (Notification.permission === "denied") return "denied"
  try {
    return await Notification.requestPermission()
  } catch {
    return "denied"
  }
}

export function canShowPush(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted"
  )
}

export function getPushPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported"
  }
  return Notification.permission
}

export function showPushNotification(options: {
  title: string
  body: string
  href?: string
  tag?: string
}) {
  if (!canShowPush()) return null
  try {
    const notification = new Notification(options.title, {
      body: options.body,
      tag: options.tag,
      data: { href: options.href },
    })
    notification.onclick = () => {
      try {
        window.focus()
        const href = options.href
        if (href) {
          window.location.href = href
        }
      } catch {
        // ignore
      }
      notification.close()
    }
    return notification
  } catch {
    return null
  }
}
