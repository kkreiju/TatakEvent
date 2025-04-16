"use client";

import * as React from "react";
import {
  PlusCircle,
  Image as ImageIcon,
  X,
  MapPin,
  Calendar,
  Users,
  Save,
  Send,
} from "lucide-react";
import { PageHeader } from "../page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface PostFormData {
  title: string;
  content: string;
  image_url: string;
  tags: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  capacity: string;
  location: string;
  attendee_count: string;
  parking: string;
}

export function CreatePostForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    image_url: "",
    tags: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    capacity: "1",
    location: "",
    attendee_count: "0",
    parking: "",
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      console.log("No image selected");
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createClient();
      
      // First check if user is verified
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("User error:", userError);
        throw new Error("You must be logged in to upload images");
      }

      // Check user verification status in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('isVerified')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
        throw new Error("Failed to check user verification status");
      }

      if (!profile?.isVerified) {
        throw new Error("You must be a verified user to upload images");
      }

      console.log("User is verified, proceeding with upload");

      // Check if we can access storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .list();
      
      if (storageError) {
        console.error("Storage access error:", storageError);
        throw new Error("Cannot access storage bucket. Please check if the 'images' bucket exists and has proper permissions.");
      }

      console.log("Storage bucket accessible:", storageData);

      // Generate a unique filename
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      console.log("Attempting to upload image...");
      console.log("File details:", {
        name: selectedImage.name,
        type: selectedImage.type,
        size: selectedImage.size,
        path: filePath
      });

      // Upload image to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, selectedImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error details:", {
          message: uploadError.message,
          name: uploadError.name
        });
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("Upload successful:", data);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log("Generated public URL:", publicUrl);

      if (!publicUrl) {
        throw new Error("Failed to generate public URL");
      }

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Detailed upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
      setFormData(prev => ({ ...prev, image_url: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setFormData(prev => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return "Event title is required";
    if (!formData.content.trim()) return "Event content is required";
    if (formData.title.length < 5) return "Title must be at least 5 characters";
    if (formData.content.length < 10) return "Content must be at least 10 characters";
    
    // Validate date range
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate < startDate) return "End date must be after start date";
    }
    
    // Validate time range if both times are provided
    if (formData.start_time && formData.end_time && formData.start_date === formData.end_date) {
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

      console.log("Starting event submission...");
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
        image_url: formData.image_url || null,
        org_user_id: user.id,
        created_at: new Date().toISOString(),
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        capacity: parseInt(formData.capacity),
        location: formData.location.trim(),
        attendee_count: parseInt(formData.attendee_count),
        parking: formData.parking.trim() || null,
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
      router.push("/landing/events");
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
    <div className="space-y-6">
      <Toaster />
      <PageHeader
        title="Create Post"
        description="Create and share your post with your team"
        icon={PlusCircle}
      />

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
                  minLength={5}
                  placeholder="Enter event title"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Event Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  minLength={10}
                  placeholder="Enter event content"
                  className="min-h-[200px]"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                    placeholder="Enter event capacity"
                    disabled={isLoading}
                  />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="parking">Parking Instructions</Label>
                <Textarea
                  id="parking"
                  name="parking"
                  value={formData.parking}
                  onChange={handleChange}
                  placeholder="Enter parking instructions"
                  className="min-h-[100px]"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                  />
                </div>

              <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
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
                <Label>Event Image</Label>
                <div className="flex flex-col gap-4">
                  {previewUrl ? (
                    <div className="relative aspect-video rounded-md overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or GIF (MAX. 5MB)
                          </p>
            </div>
                <input
                          id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                          onChange={handleImageSelect}
                          ref={fileInputRef}
                />
                      </label>
                    </div>
                  )}
                  {selectedImage && !formData.image_url && (
                  <Button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={isLoading}
                    >
                      Upload Image
                  </Button>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Event..." : "Create Event"}
              </Button>
          </form>
        </CardContent>
        </Card>
    </div>
  );
}
