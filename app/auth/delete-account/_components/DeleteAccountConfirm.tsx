"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ROUTES } from "@/constants/routes"
import {
  confirmAccountDeletion,
  fetchAccountDeleteStatus,
  getUserErrorMessage,
} from "@/lib/api/user"
import { store, persistor } from "@/store/store"
import { revertAll } from "@/store/slice/resetStore"
import { removeRefreshTokenCookie } from "@/lib/cookies"
import { resetLogoutGuard } from "@/lib/auth/tokenManager"
import { useActiveItem } from "@/hooks/handleparams"

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

async function clearSessionQuietly() {
  store.dispatch(revertAll())
  await persistor.purge()
  await removeRefreshTokenCookie()
  resetLogoutGuard()
}

export default function DeleteAccountConfirm() {
  const { activeItem: token } = useActiveItem("token")
  const [remaining, setRemaining] = useState<number | null>(null)

  const statusQuery = useQuery({
    queryKey: ["account-delete-status", token],
    queryFn: () => fetchAccountDeleteStatus(token),
    enabled: Boolean(token),
    retry: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (typeof statusQuery.data?.remaining_time_seconds === "number") {
      setRemaining(statusQuery.data.remaining_time_seconds)
    }
  }, [statusQuery.data?.remaining_time_seconds])

  const timerActive = remaining !== null && remaining > 0

  useEffect(() => {
    if (!timerActive) return
    const id = window.setInterval(() => {
      setRemaining((prev) => (prev === null ? prev : Math.max(0, prev - 1)))
    }, 1000)
    return () => window.clearInterval(id)
  }, [timerActive])

  const isExpired = remaining === 0 || statusQuery.isError
  const email = statusQuery.data?.email

  const isTokenValid =
    Boolean(token) &&
    statusQuery.isSuccess &&
    remaining !== null &&
    remaining > 0 &&
    !statusQuery.isError

  const confirmMutation = useMutation({
    mutationFn: () => confirmAccountDeletion(token),
    onSuccess: async (data) => {
      await clearSessionQuietly()
      toast.success(data.message)
      window.location.href = ROUTES.AUTH.LOGIN
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, "Could not delete account"))
    },
  })

  const subtitle = useMemo(() => {
    if (!token) return "Missing delete token."
    if (statusQuery.isLoading) return "Checking your delete link…"
    if (isExpired) return "This link is invalid or has expired."
    return "This permanently deletes your account and all data."
  }, [token, statusQuery.isLoading, isExpired])

  return (
    <Card className="w-full max-w-md border-red-500/30 bg-slate-900/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Delete account
        </CardTitle>
        <CardDescription className="text-slate-400">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!token ? (
          <p className="text-sm text-slate-300">
            Open the link from your email, or request a new one from Settings → Security.
          </p>
        ) : isExpired && !statusQuery.isLoading ? (
          <p className="text-sm text-slate-300">
            Request a new confirmation email from Settings → Security. Links expire after 20
            minutes.
          </p>
        ) : (
          <>
            {statusQuery.isLoading ? (
              <p className="text-sm text-slate-300">Validating link…</p>
            ) : (
              <p className="text-sm text-slate-300">
                Confirm deletion for{" "}
                <span className="text-cyan-300">{email ?? "your account"}</span>. This cannot be
                undone.
              </p>
            )}
            {isTokenValid && remaining !== null ? (
              <p className="text-xs text-slate-400">
                Link expires in <span className="text-amber-300">{formatTime(remaining)}</span>
              </p>
            ) : null}
            <Button
              variant="destructive"
              className="w-full font-mono"
              disabled={!isTokenValid || confirmMutation.isPending}
              onClick={() => confirmMutation.mutate()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {confirmMutation.isPending
                ? "Deleting…"
                : statusQuery.isLoading
                  ? "Validating…"
                  : "Confirm Delete Account"}
            </Button>
          </>
        )}

        <Button variant="ghost" className="w-full text-slate-300" asChild>
          <Link href={ROUTES.AUTH.LOGIN}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
