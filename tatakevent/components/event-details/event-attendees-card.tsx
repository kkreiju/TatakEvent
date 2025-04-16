"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type EventAttendeesCardProps = {
  attendees: number;
};

export default function EventAttendeesCard({
  attendees,
}: EventAttendeesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-background rounded-2xl border p-6 shadow-sm"
    >
      <h3 className="text-xl font-bold mb-4">Who's Going</h3>

      <div className="flex -space-x-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <Avatar key={i} className="border-2 border-background">
            <AvatarImage
              src={`https://images.unsplash.com/photo-${
                1570295999919 + i
              }?q=80&w=80&auto=format&fit=crop`}
            />
            <AvatarFallback>U{i + 1}</AvatarFallback>
          </Avatar>
        ))}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
          +{attendees - 5}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Join {attendees} others at this event
      </p>
    </motion.div>
  );
}
