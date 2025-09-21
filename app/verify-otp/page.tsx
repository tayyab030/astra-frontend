"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VerifyOTPPage() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const otpCode = otp.join("")
        if (otpCode.length !== 6) {
            alert("Please enter all 6 digits")
            return
        }
        setIsLoading(true)
        // Simulate OTP verification
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
        // Navigate to dashboard or success page
        router.push("/")
    }

    const handleResend = async () => {
        setTimeLeft(300)
        // Simulate resend OTP
        alert("New verification code sent!")
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 font-mono relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
            </div>

            {/* Floating Orbs */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />

            {/* Holographic Rings */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/30 rounded-full animate-spin-slow" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-blue-500/30 rounded-full animate-spin-slow-reverse" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border-cyan-500/30 shadow-2xl shadow-cyan-500/10 relative z-10">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl text-cyan-100 font-mono">Neural Verification</CardTitle>
                    <CardDescription className="text-slate-300 font-mono">
                        Enter the 6-digit code sent to your neural interface
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center space-x-3">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-xl bg-slate-700/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
                                />
                            ))}
                        </div>

                        <div className="text-center space-y-2">
                            <div className="text-slate-400 text-sm font-mono">
                                Code expires in: <span className="text-cyan-400">{formatTime(timeLeft)}</span>
                            </div>
                            {timeLeft === 0 && <div className="text-red-400 text-sm font-mono">Verification code expired</div>}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || otp.join("").length !== 6 || timeLeft === 0}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Verifying Neural Link...</span>
                                </div>
                            ) : (
                                "Activate Neural Connection"
                            )}
                        </Button>
                    </form>

                    <div className="text-center space-y-4">
                        <button
                            onClick={handleResend}
                            disabled={timeLeft > 0}
                            className="text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {timeLeft > 0 ? "Resend available in " + formatTime(timeLeft) : "Resend verification code"}
                        </button>
                        <div className="text-slate-400 text-sm font-mono">
                            Wrong neural interface?{" "}
                            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                Update profile
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
