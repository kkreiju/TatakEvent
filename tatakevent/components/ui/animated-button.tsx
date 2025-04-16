"use client";

import { Button, type ButtonProps } from "./button1";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function AnimatedButton({
  children,
  className,
  isLoading,
  loadingText,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "shadow-lg", // keeps the large shadow size
          "shadow-[var(--ring)/0.2]", // custom colored shadow
          "dark:shadow-[var(--ring)/0.3]", // dark mode variant
          "bg-[var(--primary)]", // single color background
          "hover:bg-[oklch(0.723_0.219_149.579)_80%]", // slight darkening on hover (light mode)
          "dark:hover:bg-[oklch(0.696_0.17_162.48)_80%]", // slight darkening on hover (dark mode)
          "dark:bg-[var(--sidebar-primary)]", // dark mode background color
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {loadingText || "Loading..."}
          </div>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  );
}