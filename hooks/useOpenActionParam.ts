"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

/**
 * Opens a dialog when `?action=` matches. Clears the action query when the
 * dialog closes (keeps other params like `tab`).
 */
export function useOpenActionParam(
  expectedAction: string,
  open: boolean,
  onOpenChange: (open: boolean) => void,
  enabled = true
) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!enabled) return
    if (searchParams.get("action") !== expectedAction) return
    if (open) return
    onOpenChangeRef.current(true)
  }, [enabled, expectedAction, open, searchParams])

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true
      return
    }

    if (!wasOpenRef.current) return
    wasOpenRef.current = false

    if (!enabled) return
    if (searchParams.get("action") !== expectedAction) return

    const params = new URLSearchParams(searchParams.toString())
    params.delete("action")
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [open, enabled, expectedAction, pathname, router, searchParams])
}
