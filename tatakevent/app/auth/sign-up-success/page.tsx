"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";
import { ShineBorder } from "@/components/magicui/shine-border";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6 px-4 sm:px-0">
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
                Account Created Successfully
              </h2>
              <p className="text-muted-foreground">
                Please check your email to verify your account
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a verification email to your inbox. Please click
                the link in the email to verify your account and complete the
                registration process.
              </p>
              <p className="text-sm text-muted-foreground">
                If you don&apos;t see the email, please check your spam folder.
              </p>
              <Link href="/auth/login">
                <AnimatedButton className="w-full">
                  Return to login
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
