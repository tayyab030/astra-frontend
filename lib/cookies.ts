"use server";

import { REFRESH_TOKEN_COOKIE_NAME } from "@/constants/authConstants";
// Cookie utilities for secure token storage

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function setRefreshTokenCookie(token: string) {
  // const res = NextResponse.next();
  cookies().set(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
  // return res;
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const cookieStore = cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null;
}

export async function removeRefreshTokenCookie() {
  // Clear the cookie by name
  cookies().delete(REFRESH_TOKEN_COOKIE_NAME);
}
