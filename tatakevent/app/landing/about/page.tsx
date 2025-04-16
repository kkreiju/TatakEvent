"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.2 });

  const visionRef = useRef(null);
  const visionInView = useInView(visionRef, { once: true, amount: 0.2 });

  const roadmapRef = useRef(null);
  const roadmapInView = useInView(roadmapRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
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

  const timelineEvents = [
    {
      year: "2023",
      title: "The Beginning",
      description:
        "TatakEvent was founded with a vision to connect Filipino innovators globally.",
    },
    {
      year: "2024",
      title: "First Events",
      description:
        "Launched our first events in Manila, San Francisco, and Singapore.",
    },
    {
      year: "2025",
      title: "Global Expansion",
      description:
        "Expanded to 10+ countries with a growing community of Filipino innovators.",
    },
  ];

  const visionPillars = [
    {
      title: "Empower",
      description:
        "Empowering Filipino innovators to showcase their talents on a global stage.",
      icon: "🚀",
    },
    {
      title: "Connect",
      description:
        "Building bridges between Filipino communities worldwide through meaningful events.",
      icon: "🌉",
    },
    {
      title: "Inspire",
      description:
        "Inspiring the next generation of Filipino leaders, creators, and entrepreneurs.",
      icon: "✨",
    },
  ];

  const roadmapSteps = [
    {
      title: "Community Growth",
      description: "Expand our community to reach 100,000 members globally.",
    },
    {
      title: "Event Platform",
      description:
        "Launch a dedicated platform for event creation and discovery.",
    },
    {
      title: "Global Partnerships",
      description:
        "Form strategic partnerships with Filipino organizations worldwide.",
    },
    {
      title: "Innovation Fund",
      description:
        "Create a fund to support Filipino-led startups and projects.",
    },
  ];

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Meet the Movement
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're Filipinos building for Filipinos — globally.
          </p>
        </div>

        {/* Our Story Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The journey of TatakEvent from idea to global movement
            </p>
          </div>

          {/* Timeline */}
          <motion.div
            ref={timelineRef}
            initial="hidden"
            animate={timelineInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="relative max-w-3xl mx-auto"
          >
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-muted" />

            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row-reverse" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-500" />

                {/* Content */}
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "text-right pr-8" : "pl-8"
                  }`}
                >
                  <div className="bg-background rounded-xl p-6 shadow-sm border">
                    <span className="text-sm font-bold text-yellow-500">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Facts */}
            <motion.div variants={itemVariants} className="mt-16 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background rounded-xl p-6 shadow-sm border">
                  <h3 className="text-3xl font-bold text-yellow-500 mb-2">
                    50+
                  </h3>
                  <p className="text-muted-foreground">
                    Events listed globally
                  </p>
                </div>

                <div className="bg-background rounded-xl p-6 shadow-sm border">
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">
                    15k+
                  </h3>
                  <p className="text-muted-foreground">Community members</p>
                </div>

                <div className="bg-background rounded-xl p-6 shadow-sm border">
                  <h3 className="text-3xl font-bold text-yellow-500 mb-2">
                    12
                  </h3>
                  <p className="text-muted-foreground">Countries reached</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Vision Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Building a global platform for Filipino innovation and
              collaboration
            </p>
          </div>

          <motion.div
            ref={visionRef}
            initial="hidden"
            animate={visionInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {visionPillars.map((pillar, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-background rounded-2xl p-6 shadow-sm border text-center"
              >
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground">{pillar.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* What's Next Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What's Next</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our roadmap for the future of TatakEvent
            </p>
          </div>

          <motion.div
            ref={roadmapRef}
            initial="hidden"
            animate={roadmapInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="max-w-3xl mx-auto"
          >
            {roadmapSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex mb-8 last:mb-0"
              >
                <div className="mr-4 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 bg-background rounded-xl p-6 shadow-sm border">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="mt-12 text-center">
              <Button
                asChild
                className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white font-medium px-8 shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <Link href="/landing/contact">
                  Join Our Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
