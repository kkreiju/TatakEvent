"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import EventsHeader from "@/components/events/events-header";
import EventsFilterBar from "@/components/events/events-filter-bar";
import EventsGrid from "@/components/events/events-grid";

export default function EventsPage() {
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("date");
  const [events, setEvents] = useState<any[]>([]);

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

        const { data: eventsTags, error: eventsTagsError } = await supabase
        .from("events_tags")
        .select("tag_id");

      const { data: tagsData, error: tagsError } = await supabase
        .from("tags")
        .select("name")
        .in("id", eventsTags?.map((tag) => tag.tag_id) || []);

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
          image: event.image_url || "/public/events/sample.jpg", // Fallback image
          date: `${formatDate(event.start_date)} - ${formatDate(event.end_date)}`,
          location: event.location,
          attendees: event.attendee_count,
          category: event.category,
          region: event.region,
          tags: tagsData?.map(tag => tag.name) || [], // Fallback to an empty array
        }));

        console.log(formattedEvents);
        setEvents(formattedEvents);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on selected filters
  const filteredEvents = events.filter((event) => {
    if (category !== "all" && event.category !== category) return false;
    if (region !== "all" && event.region !== region) return false;
    return true;
  });

  // Sort events based on selected sort option
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sort === "date") {
      return new Date(a.date) > new Date(b.date) ? 1 : -1;
    } else if (sort === "popularity") {
      return b.attendees - a.attendees;
    }
    return 0;
  });

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <EventsHeader />
        <EventsFilterBar
          onCategoryChange={setCategory}
          onRegionChange={setRegion}
          onSortChange={setSort}
        />
        <EventsGrid events={sortedEvents} />
      </div>
    </div>
  );
}