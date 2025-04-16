"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";

type EventSidebarDetailsProps = {
  date: string;
  time: string;
  location: string;
  attendees: number;
};

export default function EventSidebarDetails({
  date,
  time,
  location,
  attendees,
}: EventSidebarDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-background rounded-2xl border p-6 shadow-sm"
    >
      <h3 className="text-xl font-bold mb-4">Event Details</h3>

      <div className="space-y-4">
        <div className="flex items-start">
          <Calendar className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">{date}</p>
            <p className="text-muted-foreground">{time}</p>
          </div>
        </div>

        <div className="flex items-start">
          <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-muted-foreground">{location}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Users className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Attendees</p>
            <p className="text-muted-foreground">
              {attendees} people attending
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
