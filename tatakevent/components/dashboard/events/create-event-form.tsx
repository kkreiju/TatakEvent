"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface EventFormData {
  title: string;
  content: string;
  image_url: string;
  capacity: string;
  start_date: string;
  end_date: string;
  location: string;
  parking: string;
  start_time: string;
  end_time: string;
}

export function CreateEventForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    content: "",
    image_url: "",
    capacity: "",
    start_date: "",
    end_date: "",
    location: "",
    parking: "",
    start_time: "",
    end_time: "",
  });

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return "Event title is required";
    if (!formData.content.trim()) return "Event description is required";
    if (!formData.capacity.trim()) return "Capacity is required";
    if (parseInt(formData.capacity) < 1) return "Capacity must be at least 1";
    if (!formData.start_date) return "Start date is required";
    if (!formData.end_date) return "End date is required";
    if (!formData.location.trim()) return "Location is required";
    
    // Validate date range
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    if (endDate < startDate) return "End date must be after start date";
    
    // Validate time range if both times are provided
    if (formData.start_time && formData.end_time) {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
      if (endDateTime <= startDateTime) return "End time must be after start time";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      console.log("Starting form submission...");
      console.log("Form data:", formData);

      const supabase = createClient();
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log("Current user:", user);
      
      if (userError || !user) {
        console.error("User error:", userError);
        throw new Error("You must be logged in to create an event");
      }

      // Prepare event data
      const eventData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        image_url: formData.image_url.trim() || null,
        capacity: parseInt(formData.capacity),
        org_user_id: user.id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        location: formData.location.trim(),
        attendee_count: 0,
        parking: formData.parking.trim() || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        created_at: new Date().toISOString(),
      };

      console.log("Prepared event data:", eventData);

      // Insert the event
      const { data: insertedEvent, error: insertError } = await supabase
        .from("events")
        .insert([eventData])
        .select()
        .single();

      console.log("Insert response:", { insertedEvent, insertError });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("Event created successfully:", insertedEvent);
      toast.success("Event created successfully!");
      router.push("/dashboard/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    
    // Update form data
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      // If start date changes and end date is before it, update end date
      if (name === "start_date" && newData.end_date && new Date(newData.end_date) < new Date(value)) {
        newData.end_date = value;
      }

      // If start time changes and end time is before it, update end time
      if (name === "start_time" && newData.end_time && newData.start_date === newData.end_date) {
        const startTime = new Date(`${newData.start_date}T${value}`);
        const endTime = new Date(`${newData.end_date}T${newData.end_time}`);
        if (endTime <= startTime) {
          newData.end_time = value;
        }
      }

      return newData;
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter event title"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Event Description *</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Enter event description"
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Enter image URL"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                placeholder="Enter maximum number of attendees"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  min={formData.start_date || new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter event location"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking">Parking Information</Label>
              <Input
                id="parking"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                placeholder="Enter parking details"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Event..." : "Create Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 