"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventHeroBanner from "@/components/event-details/event-hero-banner";
import EventDetailsContent from "@/components/event-details/event-details-content";
import EventCommentsSection from "@/components/event-details/event-comments-section";
import EventLocationMap from "@/components/event-details/event-location-map";
import EventSidebarDetails from "@/components/event-details/event-sidebar-details";
import EventSidebarActions from "@/components/event-details/event-sidebar-actions";
import EventOrganizerCard from "@/components/event-details/event-organizer-card";
import EventAttendeesCard from "@/components/event-details/event-attendees-card";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  name: string;
  avatar: string;
  date: string;
  text: string;
};

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  isVerified: boolean;
};

type CommentWithProfile = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: Profile | null;
};

interface TagData {
  tag_id: number;
  tags: {
    name: string;
  };
}

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.id;
  const [comments, setComments] = useState<Comment[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        const { data: eventsTags, error: eventsTagsError } = await supabase
          .from("events_tags")
          .select("tag_id")
          .eq("event_id", eventId);

        const { data: tagsData, error: tagsError } = await supabase
          .from("tags")
          .select("name")
          .in("id", eventsTags?.map((tag) => tag.tag_id) || []);

        const { data: orgData, error: orgError } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, email, isVerified")
          .eq("id", data.org_user_id)
          .single();

        console.log(orgData);

        if (error) {
          console.error("Error fetching event:", error);
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

        const formatTime = (timeString: string) => {
          if (!timeString) return "TBD";
          // Assuming timeString is in format "HH:mm:ss" or "HH:mm"
          const [hours, minutes] = timeString.split(':');
          const time = new Date();
          time.setHours(parseInt(hours), parseInt(minutes));
          return time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        const getEventStatus = (startDate: string, endDate: string, startTime: string, endTime: string) => {
          const now = new Date();
          const eventStart = new Date(`${startDate}T${startTime}`);
          const eventEnd = new Date(`${endDate}T${endTime}`);

          console.log({
            now: now.toISOString(),
            eventStart: eventStart.toISOString(),
            eventEnd: eventEnd.toISOString(),
            isStarted: now >= eventStart,
            isEnded: now > eventEnd
          });

          if (now < eventStart) {
            return "Starting Soon";
          } else if (now >= eventStart && now <= eventEnd) {
            return "On Going";
          } else {
            return "Ended";
          }
        };

        const formattedEvent = {
          id: data.id,
          title: data.title,
          image: data.image_url || "/events/sample.jpg",
          date: `${formatDate(data.start_date)} - ${formatDate(data.end_date)}`,
          time: data.start_time && data.end_time ? 
            `${formatTime(data.start_time)} - ${formatTime(data.end_time)}` : 
            "TBD",
          location: data.location,
          address: data.address || data.location,
          coordinates: data.coordinates || { lat: 14.5311, lng: 120.9826 },
          attendees: data.attendee_count || 0,
          status: data.start_time && data.end_time ? 
            getEventStatus(data.start_date, data.end_date, data.start_time, data.end_time) : 
            "Starting Soon",
          organizer: {
            name: orgData?.full_name || "Event Organizer",
            image: orgData?.avatar_url || "/placeholder.svg",
            email: orgData?.email || "eventorganizer@gmail.com",
            isVerified: orgData?.isVerified || false,
          },
          tags: tagsData?.map(tag => tag.name) || [],
          parking: data.parking || "Parking details to be announced",
          description: data.content || "No description available",
        };

        console.log(formattedEvent);

        setEvent(formattedEvent);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvents();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchComments = async () => {
      const supabase = createClient();
      
      try {
        // First, get all comments for the event
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('id, content, created_at, user_id')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
          return;
        }

        if (!commentsData || commentsData.length === 0) {
          setComments([]);
          return;
        }

        // Get all unique user_ids from comments
        const userIds = [...new Set(commentsData.map(comment => comment.user_id))];

        // Fetch profiles for all users who commented
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }

        // Create a map of user_id to profile
        const profilesMap = new Map(
          profilesData.map(profile => [profile.id, profile])
        );

        // Format comments with profile information
        const formattedComments = commentsData.map((comment) => {
          const profile = profilesMap.get(comment.user_id);
          return {
            id: comment.id,
            name: profile?.full_name || 'Anonymous',
            avatar: profile?.avatar_url || '/placeholder.svg',
            date: new Date(comment.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            text: comment.content,
          };
        });

        setComments(formattedComments);
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    if (eventId) {
      fetchComments();
    }
  }, [eventId]);

  const handleCommentSubmit = async (name: string, email: string, text: string) => {
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Handle unauthenticated user
        return;
      }

      // Insert the comment
      const { data: commentData, error: commentError } = await supabase
        .from('comments')
        .insert([
          {
            event_id: eventId,
            user_id: user.id,
            content: text,
          }
        ])
        .select('id, content, created_at, user_id')
        .single();

      if (commentError) {
        console.error('Error posting comment:', commentError);
        return;
      }

      // Get the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      const newComment = {
        id: commentData.id,
        name: profileData?.full_name || 'Anonymous',
        avatar: profileData?.avatar_url || '/placeholder.svg',
        date: 'Just now',
        text: commentData.content,
      };

      setComments((prev) => [newComment, ...prev]);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Starting Soon":
        return "bg-green-500 hover:bg-green-600";
      case "On Going":
        return "bg-orange-500 hover:bg-orange-600";
      case "Ended":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <EventHeroBanner
        title={event.title}
        image={event.image}
        status={event.status}
        tags={event.tags}
        getStatusColor={getStatusColor}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <EventDetailsContent
                  description={event.description}
                  parking={event.parking}
                />
              </TabsContent>
              <TabsContent value="comments" className="mt-6">
                <EventCommentsSection
                  comments={comments}
                  onCommentSubmit={handleCommentSubmit}
                />
              </TabsContent>
            </Tabs>

            <EventLocationMap
              location={event.location}
              address={event.address}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <EventSidebarDetails
              date={event.date}
              time={event.time}
              location={event.location}
              attendees={event.attendees}
            />
            <EventSidebarActions />
            <EventOrganizerCard
              name={event.organizer.name}
              image={event.organizer.image}
              email={event.organizer.email}
              isVerified={event.organizer.isVerified}
            />
          </div>
        </div>
      </div>
    </div>
  );
}