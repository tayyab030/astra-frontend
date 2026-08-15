"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

/**
 * Opens a feature flow when `?action=` matches, then clears the action param
 * so a refresh does not re-trigger it. Other params (e.g. tab) are preserved.
 */
export function useOpenActionParam(
  expectedAction: string,
  onOpen: () => void,
  enabled = true
) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const handledRef = useRef(false)
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen

  useEffect(() => {
    if (!enabled || handledRef.current) return
    const action = searchParams.get("action")
    if (action !== expectedAction) return

    handledRef.current = true
    onOpenRef.current()

    const params = new URLSearchParams(searchParams.toString())
    params.delete("action")
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [enabled, expectedAction, pathname, router, searchParams])
}
