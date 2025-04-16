"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GoogleButton } from "@/components/ui/google-button";
import { motion } from "framer-motion";
import { ShineBorder } from "@/components/magicui/shine-border";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsGoogleLoading(true);
    setError(null);

    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsGoogleLoading(false);
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
      <GlassCard>
        <ShineBorder shineColor={["#6EE7B7", "#34D399", "#10B981"]} />
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create an Account
            </h2>
            <p className="text-muted-foreground">
              Sign up to get started with our platform
            </p>
          </div>
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-4">
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
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/20 bg-white/50 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="repeat-password"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Repeat Password
                </Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="border-white/20 bg-white/50 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
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
            <div className="space-y-4">
              <AnimatedButton
                type="submit"
                className="w-full"
                isLoading={isLoading}
                loadingText="Creating account..."
              >
                Sign up
              </AnimatedButton>
              <div className="relative flex items-center justify-center">
                <span className="relative bg-white/50 px-2 text-xs text-gray-500 dark:bg-black/20 dark:text-gray-400">
                  OR CONTINUE WITH
                </span>
              </div>
              <GoogleButton
                onClick={handleGoogleSignUp}
                isLoading={isGoogleLoading}
              >
                Sign up with Google
              </GoogleButton>
            </div>
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
    </div>
  );
}