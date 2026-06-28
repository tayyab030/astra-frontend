"use client";

import { useEffect, useState } from "react";
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
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, ResetPasswordType } from "../_schemas/reset-password.schema";
import { AUTH, publicApi } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useActiveItem } from "@/hooks/handleparams";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const InvalidToken = dynamic(
  () => import("../../verify-otp/_components/InvalidToken"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const { activeItem: token } = useActiveItem("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { ref: passwordRef, ...passwordField } = register("password");
  const { ref: confirmPasswordRef, ...confirmPasswordField } =
    register("confirmPassword");

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

  const checkResetStatus = async () => {
    if (!token) {
      setIsInvalidToken(true);
      return null;
    }

    try {
      const response = await publicApi.get(AUTH.PASSWORD_RESET_STATUS(token));
      setIsInvalidToken(false);
      setTimeLeft(response.data.remaining_time_seconds);
      return response.data;
    } catch {
      setIsInvalidToken(true);
      return null;
    }
  };

  useQuery({
    queryKey: ["password-reset-status", token],
    queryFn: checkResetStatus,
    enabled: Boolean(token),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordType) => {
      const response = await publicApi.post(AUTH.RESET_PASSWORD, {
        token,
        ...data,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successful");
      router.replace(ROUTES.AUTH.LOGIN);
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
        toast.error("Failed to reset password. Please try again.");
      }
    },
  });

  const onSubmit = (data: ResetPasswordType) => {
    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }
    mutate(data);
  };

  if (!token || isInvalidToken) {
    return (
      <InvalidToken
        tokenType="Password Reset"
        message="This password reset link is invalid or has expired."
        redirectPath={ROUTES.AUTH.FORGOT_PASSWORD}
      />
    );
  }

  return (
    <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border-cyan-500/30 shadow-2xl shadow-cyan-500/10 relative z-10">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl text-cyan-100 font-mono">
          Neural Recovery
        </CardTitle>
        <CardDescription className="text-slate-300 font-mono">
          Set your new neural pathway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-slate-400 text-sm font-mono mb-2">
          Choose a new password for your ASTRA account. This link expires in{" "}
          <span className="text-cyan-400">{formatTime(timeLeft)}</span>.
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-cyan-200 font-mono">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                {...passwordField}
                className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs font-mono">
                {errors.password.message}
              </p>
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
                ref={confirmPasswordRef}
                {...confirmPasswordField}
                className="bg-slate-700/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs font-mono">
                {errors.confirmPassword.message}
              </p>
            )}
            {confirmPassword && (
              <p
                className={`text-xs font-mono flex items-center gap-1 ${
                  passwordsMatch ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {passwordsMatch ? <Check size={14} /> : <X size={14} />}
                {passwordsMatch
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-3 space-y-1">
            {passwordRules.map(({ rule, test }) => (
              <p
                key={rule}
                className={`text-xs font-mono flex items-center gap-1 ${
                  test ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {test ? <Check size={14} /> : <X size={14} />}
                {rule}
              </p>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isPending || timeLeft <= 0}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <KeyRound size={18} />
                <span>Reset Password</span>
              </div>
            )}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
          <div className="text-slate-400 text-sm font-mono">
            Need a new link?{" "}
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Request again
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
