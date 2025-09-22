"use client"

import { AUTH, publicApi } from "@/lib/api"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import type React from "react"

const VerifyOTPPage = dynamic(() => import("./_components"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
})

export default async function Page() {
    const token = useSearchParams().get("otp_token") as string;


    return (
        <VerifyOTPPage token={token} />
    )
}
