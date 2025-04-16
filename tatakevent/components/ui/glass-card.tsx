"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type React from "react"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassCard({ children, className, ...props }: GlassCardProps & React.ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-1 backdrop-blur-xl dark:bg-black/10",
        "shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent dark:before:via-white/5",
        className,
      )}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
    >
      <div className="h-full w-full rounded-xl bg-white/40 p-6 dark:bg-black/20">{children}</div>
    </motion.div>
  )
}