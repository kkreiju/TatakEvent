"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { useDragControls } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function FeaturedEvents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useDragControls();
  const [events, setEvents] = useState<any[]>([]);

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from("events") // Replace with your table name
          .select("*");

        if (error) {
          console.error("Error fetching events:", error);
          return;
        }

        // Format dates to MM/DD/YY
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          }).format(date);
        };

        // Map the fetched data to match the desired format
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          image: event.image_url || "/sample.jpg", // Fallback image
          date: `${formatDate(event.start_date)} - ${formatDate(
            event.end_date
          )}`,
          location: event.location,
          attendees: event.attendee_count,
          category: event.category,
          region: event.region,
          tags: event.tags || [], // Fallback to an empty array
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4 text-center"
          >
            Featured Events
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-center"
          >
            Discover upcoming events connecting Filipinos around the world
          </motion.p>
        </motion.div>

        <motion.div className="overflow-hidden" variants={itemVariants}>
          <motion.div
            drag="x"
            dragControls={controls}
            dragConstraints={{ left: -1000, right: 0 }}
            dragElastic={0.1}
            className="flex gap-6 pb-4 cursor-grab active:cursor-grabbing"
            style={{ touchAction: "pan-x" }}
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                className="min-w-[300px] md:min-w-[350px] bg-background rounded-2xl shadow-sm overflow-hidden flex-shrink-0 border"
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  {/* Fix for image disappearing on hover */}
                  <div className="relative w-full h-full">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    {event.tags.map((tag: string, index: number) => (
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
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.date}</span>
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {event.attendees} attendees
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-gradient-to-r from-yellow-500/10 to-blue-600/10 hover:from-yellow-500/20 hover:to-blue-600/20 border-yellow-500/50 hover:border-blue-600/50 transition-all duration-300 group"
                  >
                    <Link href={`/landing/event/${event.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 text-center">
          <Button
            asChild
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            <Link href="/landing/events">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
