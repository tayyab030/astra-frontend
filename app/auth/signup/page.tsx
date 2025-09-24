"use client"

import dynamic from "next/dynamic"
import type React from "react"

const SignupPage = dynamic(() => import("./_components"), {
  loading: () => <p>Loading...</p>,
  ssr: false, // if you want to disable server-side rendering
})

export default function Page() {
  return (
    <>
      <SignupPage />
    </>
  )
}
