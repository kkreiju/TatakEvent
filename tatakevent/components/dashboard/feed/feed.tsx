"use client";

import * as React from "react";
import {
  Calendar,
  MapPin,
  Search,
  Filter,
  Users,
  Clock,
  Globe,
  ArrowUpDown,
  Tag
} from "lucide-react";
import { PageHeader } from "../page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

interface Event {
  id: string;
  title: string;
  content: string;
  image_url: string;
  capacity: number;
  start_date: string;
  end_date: string;
  location: string;
  parking: string;
  start_time: string;
  end_time: string;
  attendee_count: number;
  org_user_id: string;
  created_at: string;
  organizer: {
    full_name: string;
    avatar_url: string;
  } | null;
}

export function Feed() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("date");
  const [selectedLocation, setSelectedLocation] = React.useState("all");
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const supabase = createClient();
        
        // Fetch events with organizer information
        const { data: eventsData, error } = await supabase
          .from('events')
          .select(`
            *,
            organizer:org_user_id (
              full_name,
              avatar_url
            )
          `)
          .order('start_date', { ascending: true });

        if (error) {
          throw error;
        }

        setEvents(eventsData || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = selectedLocation === "all" || event.location.includes(selectedLocation);
    
    return matchesSearch && matchesLocation;
  });

  // Sort events based on selected criteria
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      case 'attendees':
        return b.attendee_count - a.attendee_count;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Discover amazing events from around the world"
        icon={Calendar}
      />

      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, locations, or descriptions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <span>Sort by</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="attendees">Attendees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[160px]">
              <Globe className="mr-2 h-4 w-4" />
              <span>Location</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="USA">United States</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Japan">Japan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedEvents.map(event => (
          <Card key={event.id} className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full lg:w-[400px] h-[250px] sm:h-[300px] bg-gray-100 overflow-hidden">
                <img
                  src={event.image_url || '/placeholder-event.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
                  style={{
                    objectPosition: 'center center',
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2 sm:line-clamp-3">{event.content}</p>
                  </div>
                  <Badge variant="secondary" className="self-start sm:self-auto">
                    {event.capacity - event.attendee_count} spots left
                  </Badge>
                </div>
                
                <div className="grid gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(event.start_date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.start_time || 'TBA'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.attendee_count} attendees</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={event.organizer?.avatar_url} />
                      <AvatarFallback>
                        {event.organizer?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{event.organizer?.full_name || 'Anonymous'}</span>
                  </div>
                  <Button className="w-full sm:w-auto">View Details</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {sortedEvents.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No events found matching your criteria
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
