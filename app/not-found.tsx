"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, ArrowLeft, Zap } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function NotFound() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-mono relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
                        backgroundSize: "50px 50px",
                        animation: "grid-move 20s linear infinite",
                    }}
                />
            </div>

            {/* Floating Orbs */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-bounce" />
            <div className="absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse" />

            {/* Holographic Rings */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/30 rounded-full animate-spin-slow" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-blue-500/30 rounded-full animate-spin-reverse" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <div className="text-center max-w-2xl mx-auto">
                    {/* Error Code */}
                    <div className="mb-8">
                        <h1 className="text-8xl md:text-9xl font-bold text-cyan-200 mb-4 animate-pulse">404</h1>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                            <span className="text-cyan-400 text-lg tracking-wider">NEURAL PATHWAY DISCONNECTED</span>
                            <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="backdrop-blur-sm bg-slate-800/30 border border-cyan-500/30 rounded-lg p-8 mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-cyan-200 mb-4">This page could not be found.</h2>
                        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                            The neural pathway you're looking for has been severed or relocated. Our AI systems are working to restore
                            the connection.
                        </p>

                        {/* Glitch Effect Text */}
                        <div className="text-red-400 font-mono text-sm mb-6 opacity-70">ERROR_CODE: PATHWAY_NOT_FOUND_0x404</div>
                    </div>

                    {/* Navigation Options */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={ROUTES.PUBLIC.HOME}
                            className="group flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                        >
                            <Home className="w-5 h-5 group-hover:animate-pulse" />
                            Return to Base
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="group flex items-center justify-center gap-3 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-cyan-500/50 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
                            Go Back
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-slate-400 text-sm">
                        <p>If you believe this is an error, please contact our neural support team.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
        </div>
    )
}
