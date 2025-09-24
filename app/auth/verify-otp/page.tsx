"use client"

import dynamic from "next/dynamic"
import type React from "react"

const VerifyOTPPage = dynamic(() => import("./_components"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
})

export default async function Page() {


    return (
        <VerifyOTPPage />
    )
}
