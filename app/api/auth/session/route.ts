import { NextResponse } from "next/server"
import { getRefreshTokenCookie } from "@/lib/cookies"

export async function GET() {
  const refreshToken = await getRefreshTokenCookie()
  return NextResponse.json({ authenticated: Boolean(refreshToken) })
}
