"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
        setIsSubmitted(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 font-mono relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
            </div>

            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />

            <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/30 rounded-full animate-spin-slow" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-blue-500/30 rounded-full animate-spin-slow-reverse" />

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
                    <CardTitle className="text-3xl text-cyan-100 font-mono">Neural Recovery</CardTitle>
                    <CardDescription className="text-slate-300 font-mono">
                        {isSubmitted ? "Recovery link transmitted" : "Reset your neural pathway"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!isSubmitted ? (
                        <>
                            <div className="text-center text-slate-400 text-sm font-mono mb-6">
                                Enter your registered neural address and we'll send you a secure recovery link to restore access to your
                                ASTRA Life OS.
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-cyan-200 font-mono">
                                        Neural Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
                                        placeholder="neural@astra.ai"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Transmitting...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Mail size={18} />
                                            <span>Send Recovery Link</span>
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-cyan-100 font-mono text-lg">Recovery Link Sent</div>
                            <div className="text-slate-400 text-sm font-mono">
                                We've transmitted a secure recovery link to <span className="text-cyan-400">{email}</span>. Check your
                                neural inbox and follow the instructions to restore access to your ASTRA Life OS.
                            </div>
                            <div className="text-slate-500 text-xs font-mono mt-4">
                                Didn't receive the transmission? Check your spam folder or try again in a few minutes.
                            </div>
                        </div>
                    )}

                    <div className="text-center space-y-4">
                        <Link
                            href={ROUTES.AUTH.LOGIN}
                            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Login</span>
                        </Link>
                        <div className="text-slate-400 text-sm font-mono">
                            New to ASTRA?{" "}
                            <Link href={ROUTES.AUTH.SIGNUP} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                Create neural profile
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
