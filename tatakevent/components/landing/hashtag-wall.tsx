"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function HashtagWall() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const hashtags = [
    "#InnovatePH",
    "#TatakEventTokyo",
    "#PinoyStartups",
    "#FilipinoPride",
    "#TechPinoy",
    "#GlobalFilipino",
    "#PinoyInnovators",
    "#FilCreatives",
    "#TatakEventSF",
    "#PinoyTalent",
    "#FilTech",
    "#PinoyEntrepreneurs",
    "#TatakEventSG",
    "#FilipinoDev",
    "#PinoyDesigners",
    "#TatakEventLondon",
    "#PinoyCreators",
    "#FilipinoBusiness",
    "#TatakEventSydney",
    "#PinoyExcellence",
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Join the Conversation
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            See what the community is talking about
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
        >
          {hashtags.map((hashtag, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              custom={index}
              whileHover={{
                scale: 1.1,
                backgroundColor: index % 2 === 0 ? "#FACC15" : "#2563EB",
                color: index % 2 === 0 ? "#000" : "#fff",
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                index % 2 === 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {hashtag}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
