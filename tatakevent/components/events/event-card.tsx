"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export type EventCardProps = {
  id: number;
  title: string;
  image: string;
  date: string;
  location: string;
  attendees: number;
  tags: string[];
  index?: number;
};

export default function EventCard({
  id,
  title,
  image,
  date,
  location,
  attendees,
  tags,
  index = 0,
}: EventCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      className="bg-background rounded-2xl shadow-sm overflow-hidden border"
    >
      <div className="relative h-48 overflow-hidden">
        {/* Fix for image disappearing on hover */}
        <div className="relative w-full h-full">
          <Image
            src={image || "/public/events/sample.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          {(tags || []).slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-3 line-clamp-2">{title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{date}</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{attendees} attendees</span>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="w-full bg-gradient-to-r from-yellow-500/10 to-blue-600/10 hover:from-yellow-500/20 hover:to-blue-600/20 border-yellow-500/50 hover:border-blue-600/50 transition-all duration-300 group"
        >
          <Link href={`/landing/event/${id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
