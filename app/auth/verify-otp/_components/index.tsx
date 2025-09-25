"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH, publicApi } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useActiveItem } from "@/hooks/handleparams";
import { ROUTES } from "@/constants/routes";

const InvalidToken = dynamic(() => import("./InvalidToken"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});

export default function VerifyOTPPage() {
    const length = 6;

    const [otp, setOtp] = useState(new Array(length).fill(""));
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isInvalidToken, setIsInvalidToken] = useState(false);

    const { activeItem: token, setActiveItem: setToken } =
        useActiveItem("otp_token");

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    const checkOtpStatus = async () => {
        try {
            const response = await publicApi.get(AUTH.OTP_STATUS(token));

            setIsInvalidToken(false);
            setTimeLeft(response.data.remaining_time_seconds);
            return response.data;
        } catch (error) {
            setIsInvalidToken(true);
            console.error(error);
        }
    };

    const { data: status, refetch: refetchOtpStatus } = useQuery({
        queryKey: ["otp-status", token],
        queryFn: checkOtpStatus,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value;
        if (isNaN(Number(value))) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Take only the last character
        setOtp(newOtp);

        // Move to the next input if a digit is entered and it's not the last field
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        // Move to the previous input on backspace if the current field is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            toast.error("Please enter all 6 digits");
            return;
        } else if (!status?.user_id) {
            toast.error("User not found");
            return;
        }

        try {
            await publicApi.post(AUTH.VERIFY_OTP, {
                user_id: status?.user_id,
                otp_code: otpCode,
            });
            toast.success("OTP verified successfully");
            router.push(ROUTES.AUTH.LOGIN);
        } catch (error: any) {
            console.error(error);
            const errorData = error?.response?.data;
            if (!errorData || typeof errorData !== "object")
                toast.error("Failed to verify OTP");

            // Extract values safely
            const otpMsg = errorData.otp_code?.[0];
            const attemptsUsed = errorData.attempts_used?.[0];
            const maxAttempts = errorData.max_attempts?.[0];
            const remaining = errorData.remaining_attempts?.[0];
            const errorType = errorData.error_type?.[0];

            if (errorType === "invalid_code") {
                toast.error(
                    otpMsg ||
                    `Invalid OTP. You have used ${attemptsUsed}/${maxAttempts} attempts. ${remaining} left.`
                );
                refetchOtpStatus();
                setOtp(new Array(length).fill(""));
            } else toast.error("Unknown error occurred.");
        }

        // Navigate to dashboard or success page
    };

    const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation({
        mutationFn: handleSubmit,
    });

    const handleResend = async () => {
        try {
            const response = await publicApi.post(AUTH.RESEND_OTP, {
                user_id: status?.user_id,
            });
            setToken(response?.data?.otp?.token || "");
            // Simulate resend OTP
            toast.success("New verification code sent!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to resend verification code");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (isInvalidToken) return <InvalidToken />;

    return (
        <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border-cyan-500/30 shadow-2xl shadow-cyan-500/10 relative z-10">
            <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl text-cyan-100 font-mono">
                    Neural Verification
                </CardTitle>
                <CardDescription className="text-slate-300 font-mono">
                    Enter the 6-digit code sent to your neural interface
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={verifyOtp} className="space-y-6">
                    <div className="flex justify-center space-x-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => {
                                    if (el) {
                                        inputRefs.current[index] = el;
                                    }
                                }}
                                className={cn(
                                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                                    "w-12 h-12 text-center text-xl bg-slate-700/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
                                )}
                            />
                        ))}
                    </div>

                    <div className="text-center space-y-2">
                        <div className="text-slate-400 text-sm font-mono">
                            Code expires in:{" "}
                            <span className="text-cyan-400">{formatTime(timeLeft)}</span>
                        </div>
                        {timeLeft === 0 && (
                            <div className="text-red-400 text-sm font-mono">
                                Verification code expired
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={
                            isVerifyingOtp || otp.join("").length !== 6 || timeLeft === 0
                        }
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
                    >
                        {isVerifyingOtp ? (
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
                        {timeLeft > 0
                            ? "Resend available in " + formatTime(timeLeft)
                            : "Resend verification code"}
                    </button>
                    <div className="text-slate-400 text-sm font-mono">
                        Wrong neural interface?{" "}
                        <Link
                            href={ROUTES.AUTH.SIGNUP}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Update profile
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
