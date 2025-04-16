"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { marked } from "marked";

type EventDetailsContentProps = {
  description: string;
  parking: string;
};

export default function EventDetailsContent({
  description,
  parking,
}: EventDetailsContentProps) {
  const [parsedDescription, setParsedDescription] = useState("");
  const [parsedParking, setParsedParking] = useState("");

  useEffect(() => {
    const parseMarkdown = async () => {
      const parsedDesc = await marked.parse(description);
      const parsedPark = await marked.parse(parking);
      setParsedDescription(parsedDesc);
      setParsedParking(parsedPark);
    };

    parseMarkdown();
  }, [description, parking]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="prose prose-lg dark:prose-invert max-w-none"
    >
      {/* Event Description */}
      <div dangerouslySetInnerHTML={{ __html: parsedDescription }} />

      {/* Parking Information */}
      <div className="mt-10 pt-10 border-t">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">Parking Information</h2>
        </div>
        <div dangerouslySetInnerHTML={{ __html: parsedParking }} />
      </div>
    </motion.div>
  );
}
