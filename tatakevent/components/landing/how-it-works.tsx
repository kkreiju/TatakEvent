"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Search, Users, Globe } from "lucide-react"

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const steps = [
    {
      icon: <Search className="h-12 w-12 text-yellow-500" />,
      title: "Discover Events",
      description: "Find Filipino-led events happening around the world that match your interests and location.",
    },
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: "Join the Vibe",
      description: "Connect with fellow Filipinos and participate in events that inspire innovation and collaboration.",
    },
    {
      icon: <Globe className="h-12 w-12 text-yellow-500" />,
      title: "Inspire the World",
      description: "Be part of a global movement showcasing Filipino talent, creativity, and innovation.",
    },
  ]

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TatakEvent makes it easy to discover, join, and create events that connect Filipinos worldwide.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-background shadow-sm"
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  delay: index * 0.3,
                }}
                className="mb-6"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
