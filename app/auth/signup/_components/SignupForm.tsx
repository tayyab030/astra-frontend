"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { schema, SignUpType } from "../_schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH, publicApi } from "@/lib/api";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

export default function SignupForm() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignUpType>({
        resolver: zodResolver(schema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");

    const passwordRules = [
        { rule: "At least 1 uppercase letter", test: /[A-Z]/.test(password) },
        { rule: "At least 1 lowercase letter", test: /[a-z]/.test(password) },
        { rule: "At least 1 number", test: /\d/.test(password) },
        {
            rule: "At least 1 special character",
            test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
        { rule: "Minimum 8 characters", test: password.length >= 8 },
    ];

    const passwordsMatch =
        password && confirmPassword && password === confirmPassword;

    const onSubmit = async (data: SignUpType) => {
        if (!watch("terms")) {
            return;
        }
        try {
            const response = await publicApi.post(AUTH.REGISTER, data);
            toast.success(response?.data?.message || "Profile created successfully");

            router.push(`${ROUTES.AUTH.VERIFY_OTP}?otp_token=${response?.data?.otp_token}`);
        } catch (error: any) {
            console.error(error);
            if (error.response?.data) {
                const errors = error.response.data;

                // Collect all error messages
                const allMessages: string[] = [];
                Object.keys(errors).forEach((field) => {
                    const fieldErrors = errors[field];
                    if (Array.isArray(fieldErrors)) {
                        allMessages.push(...fieldErrors);
                    } else {
                        allMessages.push(String(fieldErrors));
                    }
                });

                // Join all messages into a single string
                toast.error(allMessages.map((message, index) => <p key={index}>{message}</p>)); // separator can be "\n" for newlines
            } else if (error.request) {
                toast.error("No response from server. Please try again.");
            } else {
                toast.error(error.message || "Unexpected error");
            }
        }
    };

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
                    <CardTitle className="text-3xl text-cyan-100 font-mono">
                        Join ASTRA
                    </CardTitle>
                    <CardDescription className="text-slate-300 font-mono">
                        Initialize your neural profile
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-cyan-200 font-mono">
                                    First Name
                                </Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    {...register("first_name")}
                                    className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
                                    placeholder="Enter your first name..."
                                    onChange={(e) => setValue("first_name", e.target.value)}
                                />
                                {errors.first_name && (
                                    <p className="text-red-400 text-xs font-mono">
                                        {errors.first_name.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-cyan-200 font-mono">
                                    Last Name
                                </Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    {...register("last_name")}
                                    className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
                                    placeholder="Enter your last name..."
                                    onChange={(e) => setValue("last_name", e.target.value)}
                                />
                                {errors.last_name && (
                                    <p className="text-red-400 text-xs font-mono">
                                        {errors.last_name.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-cyan-200 font-mono">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                {...register("username")}
                                className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
                                placeholder="Enter your username..."
                                onChange={(e) => setValue("username", e.target.value)}
                            />
                            {errors.username && (
                                <p className="text-red-400 text-xs font-mono">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-cyan-200 font-mono">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
                                placeholder="Enter your email..."
                                onChange={(e) => setValue("email", e.target.value)}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs font-mono">
                                    {errors.email.message}
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
                                    className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono pr-10"
                                    placeholder="Enter your password..."
                                    onChange={(e) => setValue("password", e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {password && (
                                <div className="mt-3 space-y-2">
                                    {passwordRules.map((rule, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2 text-xs font-mono"
                                        >
                                            {rule.test ? (
                                                <Check size={14} className="text-green-400" />
                                            ) : (
                                                <X size={14} className="text-red-400" />
                                            )}
                                            <span
                                                className={
                                                    rule.test ? "text-green-400" : "text-red-400"
                                                }
                                            >
                                                {rule.rule}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-cyan-200 font-mono"
                            >
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono pr-10"
                                    placeholder="Enter your confirm password..."
                                    onChange={(e) => setValue("confirmPassword", e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {confirmPassword && (
                                <div className="flex items-center space-x-2 text-xs font-mono mt-2">
                                    {passwordsMatch ? (
                                        <>
                                            <Check size={14} className="text-green-400" />
                                            <span className="text-green-400">Passwords match</span>
                                        </>
                                    ) : (
                                        <>
                                            <X size={14} className="text-red-400" />
                                            <span className="text-red-400">
                                                Passwords do not match
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                {...register("terms")}
                                id="terms"
                                checked={watch("terms")}
                                onCheckedChange={() => setValue("terms", !watch("terms"))}
                                className="border-cyan-500/30 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                            />
                            <Label
                                htmlFor="terms"
                                className="text-sm text-slate-300 font-mono"
                            >
                                I accept the{" "}
                                <Link
                                    href="/terms"
                                    className="text-cyan-400 hover:text-cyan-300"
                                >
                                    Neural Terms
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/privacy"
                                    className="text-cyan-400 hover:text-cyan-300"
                                >
                                    Privacy Protocol
                                </Link>
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || !watch("terms") || !passwordsMatch}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Creating Profile...</span>
                                </div>
                            ) : (
                                "Initialize Neural Link"
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <div className="text-slate-400 text-sm font-mono">
                            Already have a neural profile?{" "}
                            <Link
                                href={ROUTES.AUTH.LOGIN}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Access system
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
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
    );
}
