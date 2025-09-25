import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { LoginType, schema } from '../_schemas/login.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AUTH, publicApi } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<LoginType>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: LoginType) => {
        try {
            const response = await publicApi.post(AUTH.LOGIN, data);
            toast.success(response?.data?.message || "Login successful");
            return response.data;
        } catch (error: any) {
            console.error(error);
            const nonFieldErrors = error?.response.data.non_field_errors
            if (Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0) {
                toast.error(nonFieldErrors.map((error: string) => <p key={error}>{error}</p>));
            } else {
                toast.error("Login failed");
            }
        }
    }

    const { mutate: handleLogin, isPending: isLoggingIn } = useMutation({
        mutationFn: onSubmit,
    })

    return (
        <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border-cyan-500/30 shadow-2xl shadow-cyan-500/10 relative z-10">
            <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl text-cyan-100 font-mono">ASTRA Login</CardTitle>
                <CardDescription className="text-slate-300 font-mono">Access your Life OS dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit((data) => handleLogin(data))} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-cyan-200 font-mono">
                            Email or Username
                        </Label>
                        <Input
                            id="email"
                            type="text"
                            {...register("login")}
                            value={watch("login")}
                            onChange={(e) => setValue("login", e.target.value)}
                            className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
                            placeholder="Enter your email or username"
                            required
                        />
                        {errors.login && (
                            <p className="text-red-400 text-xs font-mono">
                                {errors.login.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-cyan-200 font-mono">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                value={watch("password")}
                                onChange={(e) => setValue("password", e.target.value)}
                                className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono pr-10"
                                placeholder="Enter your password"
                                required
                            />
                            {errors.password && (
                                <p className="text-red-400 text-xs font-mono">
                                    {errors.password.message}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300"
                    >
                        {isLoggingIn ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Authenticating...</span>
                            </div>
                        ) : (
                            "Initialize Session"
                        )}
                    </Button>
                </form>

                <div className="text-center space-y-4">
                    <Link
                        href={ROUTES.AUTH.FORGOT_PASSWORD}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
                    >
                        Forgot neural pathway?
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
    )
}

export default LoginForm