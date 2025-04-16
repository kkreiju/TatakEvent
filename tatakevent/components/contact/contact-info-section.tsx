"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactInfoSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p className="text-muted-foreground mb-8">
          Have questions about TatakEvent? Want to partner with us? Or just want
          to say hi? We're here to help!
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Mail className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Email Us</h3>
            <p className="text-muted-foreground">hello@tatakevent.com</p>
            <p className="text-muted-foreground">support@tatakevent.com</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Call Us</h3>
            <p className="text-muted-foreground">+63 (2) 8123 4567</p>
            <p className="text-muted-foreground">+1 (415) 555-1234</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Visit Us</h3>
            <p className="text-muted-foreground">BGC, Taguig City</p>
            <p className="text-muted-foreground">Metro Manila, Philippines</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
