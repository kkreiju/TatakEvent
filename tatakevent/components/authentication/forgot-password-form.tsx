"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";
import { ShineBorder } from "@/components/magicui/shine-border";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col gap-6 px-4 sm:px-0",
        className
      )}
      {...props}
    >
      {success ? (
        <GlassCard>
          <ShineBorder shineColor={["#6EE7B7", "#34D399", "#10B981"]} />
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Check Your Email
              </h2>
              <p className="text-muted-foreground">
                Password reset instructions sent
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
            <Link href="/auth/login">
              <AnimatedButton className="w-full">
                Return to login
              </AnimatedButton>
            </Link>
          </div>
        </GlassCard>
      ) : (
        <GlassCard>
          <ShineBorder shineColor={["#6EE7B7", "#34D399", "#10B981"]} />
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Reset Your Password
              </h2>
              <p className="text-muted-foreground">
                Type in your email and we&apos;ll send you a link to reset your
                password
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/20 bg-white/50 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium text-red-500"
                >
                  {error}
                </motion.p>
              )}
              <AnimatedButton
                type="submit"
                className="w-full"
                isLoading={isLoading}
                loadingText="Sending..."
              >
                Send reset email
              </AnimatedButton>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-purple-600 transition-colors hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
