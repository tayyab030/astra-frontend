"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import Link from "next/link";
import { ArrowLeft, Clock, Mail } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, ForgotPasswordType } from "../_schemas/forgot-password.schema";
import { AUTH, publicApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const { ref: emailRef, ...emailField } = register("email");
  const email = watch("email", "");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [linkSent, setLinkSent] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ForgotPasswordType) => {
      const response = await publicApi.post(AUTH.FORGOT_PASSWORD, data);
      return response.data;
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      setLinkSent(data?.sent !== false);
      setRemainingSeconds(
        typeof data?.remaining_time_seconds === "number"
          ? data.remaining_time_seconds
          : null
      );

      if (data?.sent === false) {
        toast.success(
          data?.message || "Your recovery link is still valid. Check your inbox."
        );
      } else {
        toast.success(data?.message || "Recovery link sent");
      }
    },
    onError: (error: any) => {
      if (error.response?.data) {
        const fieldErrors = error.response.data;
        const messages: string[] = [];
        Object.keys(fieldErrors).forEach((field) => {
          const value = fieldErrors[field];
          if (Array.isArray(value)) {
            messages.push(...value);
          } else {
            messages.push(String(value));
          }
        });
        toast.error(messages.join(" "));
      } else {
        toast.error("Failed to send recovery link. Please try again.");
      }
    },
  });

  const onSubmit = (data: ForgotPasswordType) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border-cyan-500/30 shadow-2xl shadow-cyan-500/10 relative z-10">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl text-cyan-100 font-mono">
          Neural Recovery
        </CardTitle>
        <CardDescription className="text-slate-300 font-mono">
          {isSubmitted
            ? linkSent
              ? "Recovery link transmitted"
              : "Recovery link still active"
            : "Reset your neural pathway"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            <div className="text-center text-slate-400 text-sm font-mono mb-6">
              Enter your registered neural address and we&apos;ll send you a
              secure recovery link to restore access to your ASTRA Life OS.
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-200 font-mono">
                  Neural Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  ref={emailRef}
                  {...emailField}
                  className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
                  placeholder="neural@astra.ai"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs font-mono">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300"
              >
                {isPending ? (
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
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                linkSent
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                  : "bg-gradient-to-r from-amber-500 to-orange-500"
              }`}
            >
              {linkSent ? (
                <Mail className="w-8 h-8 text-white" />
              ) : (
                <Clock className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="text-cyan-100 font-mono text-lg">
              {linkSent ? "Recovery Link Sent" : "Recovery Link Still Valid"}
            </div>
            <div className="text-slate-400 text-sm font-mono">
              {linkSent ? (
                <>
                  We&apos;ve transmitted a secure recovery link to{" "}
                  <span className="text-cyan-400">{email}</span>. Check your
                  neural inbox and follow the instructions to restore access to
                  your ASTRA Life OS.
                </>
              ) : (
                <>
                  A recovery link was already sent to{" "}
                  <span className="text-cyan-400">{email}</span> and is still
                  active
                  {remainingSeconds !== null && (
                    <>
                      {" "}
                      for{" "}
                      <span className="text-amber-400">
                        {formatTime(remainingSeconds)}
                      </span>
                    </>
                  )}
                  . Check your inbox and use the existing link — a new email was
                  not sent.
                </>
              )}
            </div>
            <div className="text-slate-500 text-xs font-mono mt-4">
              {linkSent
                ? "Didn't receive the transmission? Check your spam folder or try again in a few minutes."
                : "Wait for the link to expire before requesting a new one, or use the link from your earlier email."}
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
            <Link
              href={ROUTES.AUTH.SIGNUP}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Create neural profile
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
