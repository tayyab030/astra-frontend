"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AstraLogo } from "@/components/astra-logo"
import { AlertTriangle, RefreshCw, Home, Shield, Zap } from "lucide-react"

interface InvalidTokenPageProps {
    tokenType?: string
    message?: string
    redirectPath?: string
}

export default function InvalidToken({
    tokenType = "Authentication",
    message = "The token you provided is invalid or has expired.",
    redirectPath = "/login",
}: InvalidTokenPageProps) {
    const router = useRouter()

    const handleRetry = () => {
        router.push(redirectPath)
    }

    const handleGoHome = () => {
        router.push("/")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

            {/* Floating orbs with error theme */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
            <div
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute top-1/2 left-1/6 w-24 h-24 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "1s" }}
            ></div>

            {/* Holographic rings */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-red-500/10 rounded-full animate-spin pointer-events-none"
                style={{ animationDuration: "20s" }}
            ></div>
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-orange-500/10 rounded-full animate-spin pointer-events-none"
                style={{ animationDuration: "15s", animationDirection: "reverse" }}
            ></div>

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-40 pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                ></div>
            ))}

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <AstraLogo className="h-12 w-auto mx-auto mb-6 text-red-400" />
                    </Link>

                    <Badge
                        variant="secondary"
                        className="mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30 backdrop-blur-sm"
                    >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        {tokenType} Error
                    </Badge>

                    <h1 className="text-3xl font-bold font-mono mb-2 text-red-300">Invalid Token</h1>
                    <p className="text-slate-200 font-mono text-sm">Access denied - token verification failed</p>
                </div>

                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-red-500/20 shadow-2xl shadow-red-500/10 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5"></div>

                    <CardHeader className="space-y-1 relative text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-red-500/20">
                            <Zap className="w-8 h-8 text-red-400" />
                        </div>
                        <CardTitle className="text-xl font-mono text-slate-100">Token Verification Failed</CardTitle>
                        <CardDescription className="font-mono text-slate-300">{message}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 relative">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm">
                            <div className="flex items-start space-x-3">
                                <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-mono text-red-300 font-medium">Security Notice</p>
                                    <p className="text-xs font-mono text-slate-300">
                                        This could happen if your token has expired, been revoked, or is malformed. Please try
                                        authenticating again.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleRetry}
                                className="w-full font-mono bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg shadow-red-500/25 border border-red-400/20"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>

                            <Button
                                onClick={handleGoHome}
                                variant="outline"
                                className="w-full font-mono bg-slate-900/50 border-slate-600/50 text-slate-200 hover:bg-slate-800/50 hover:text-white backdrop-blur-sm"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500 font-mono">
                        Neural security protocols active • Quantum token validation failed
                    </p>
                </div>
            </div>
        </div>
    )
}
