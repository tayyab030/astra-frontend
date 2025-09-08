"use client"

import dynamic from "next/dynamic"
import type React from "react"

import { useState } from "react"

const OTPVerification = dynamic(() => import("./VerifyOTP"))
const SignupForm = dynamic(() => import("./SignupForm"))

export default function SignupPage() {
    const [step, setStep] = useState<'signup' | 'otp'>('signup')

    return (
        <>
            {step === "signup" && <SignupForm />}
            {step === "otp" && <OTPVerification />}
        </>
    )
}
