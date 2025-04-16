"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const pinVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.8 + i * 0.2,
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    }),
  };

  // Locations for pins on the map
  const pins = [
    { x: "20%", y: "30%", delay: 0 }, // Manila
    { x: "80%", y: "20%", delay: 1 }, // New York
    { x: "40%", y: "15%", delay: 2 }, // London
    { x: "70%", y: "40%", delay: 3 }, // Sydney
    { x: "60%", y: "25%", delay: 4 }, // Tokyo
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated world map background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95 dark:from-background/90 dark:to-background/98 z-10" />
        <div className="h-full w-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20 dark:opacity-10" />

        {/* Animated pins */}
        {pins.map((pin, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={pinVariants}
            initial="hidden"
            animate="visible"
            className="absolute w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"
            style={{
              left: pin.x,
              top: pin.y,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              className="absolute inset-0 rounded-full bg-yellow-500 -z-10"
            />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 z-10 py-20">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="text-yellow-500">Tatak</span>
            <span className="text-blue-600">Event</span> Unites Filipinos in
            Innovation
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Discover events that connect Filipinos globally through innovation,
            culture, and community.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium px-8 shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              <Link href="/landing/events">
                Explore Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium px-8 shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              <Link href="/about">Why TatakEvent?</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
