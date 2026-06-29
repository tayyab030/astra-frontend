"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AstraLogo } from "@/components/astra-logo"
import { ROUTES } from "@/constants/routes"
import { useAppSelector } from "@/store/hooks"

export function PublicNavbar() {
  const reduxAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated && state.user.isAuthenticated,
  )
  const [hasSession, setHasSession] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/auth/session", { credentials: "include" })
      .then((response) => response.json())
      .then((data: { authenticated?: boolean }) => {
        if (!cancelled) {
          setHasSession(Boolean(data.authenticated))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasSession(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const isAuthenticated = reduxAuthenticated || hasSession === true
  const isCheckingSession = !reduxAuthenticated && hasSession === null

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/80 border-b border-cyan-500/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href={ROUTES.PUBLIC.HOME}>
            <AstraLogo className="text-cyan-400" />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={ROUTES.PUBLIC.PRODUCT}
              className="text-slate-300 hover:text-cyan-400 font-medium transition-colors"
            >
              Product
            </Link>
            <Link
              href={ROUTES.PUBLIC.FEATURES}
              className="text-slate-300 hover:text-cyan-400 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href={ROUTES.PUBLIC.PRICING}
              className="text-slate-300 hover:text-cyan-400 font-medium transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4 min-w-[180px] justify-end">
            {isCheckingSession ? (
              <div className="h-9 w-28 rounded-full bg-slate-800/60 animate-pulse" />
            ) : isAuthenticated ? (
              <Link href={ROUTES.APP.DASHBOARD}>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-6 shadow-lg shadow-cyan-500/25">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href={ROUTES.AUTH.LOGIN}>
                  <Button variant="ghost" className="text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10">
                    Sign in
                  </Button>
                </Link>
                <Link href={ROUTES.AUTH.LOGIN}>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-6 shadow-lg shadow-cyan-500/25">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
