"use client";

import * as React from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit2,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ImageIcon,
  LinkIcon,
  Shield,
  Upload,
  X,
  CheckCircle,
} from "lucide-react";
import { PageHeader } from "../page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
}

interface UserData {
  name: string;
  email: string;
  avatar: string;
  initials: string;
  role: string;
  bio: string;
  location: string;
  joinDate: string;
  skills: string[];
  isVerified: boolean;
  stats: {
    events: number;
    followers: number;
    following: number;
  };
}

export function ProfileView() {
  const [activeTab, setActiveTab] = React.useState("events");
  const [isEditing, setIsEditing] = React.useState(false);
  const [likedPosts, setLikedPosts] = React.useState<number[]>([]);
  const [commentText, setCommentText] = React.useState("");
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [verificationImage, setVerificationImage] = React.useState<File | null>(null);
  const [verificationImageUrl, setVerificationImageUrl] = React.useState<string>("");
  const [isSubmittingVerification, setIsSubmittingVerification] = React.useState(false);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = React.useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error getting user:", userError);
          return;
        }

        if (!user) {
          console.error("No authenticated user found");
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        // Fetch user's events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('org_user_id', user.id)
          .order('start_date', { ascending: false });

        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          return;
        }

        // Structure the user data
        const structuredUserData: UserData = {
          name: profile.full_name || "Anonymous",
          email: user.email || "",
          avatar: profile.avatar_url || "/placeholder.svg",
          initials: profile.full_name?.split(' ').map((n: string) => n[0]).join('') || "AN",
          role: profile.role || "Event Organizer",
          bio: profile.bio || "No bio available",
          location: profile.location || "Location not set",
          joinDate: new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          skills: profile.skills || [],
          isVerified: profile.isVerified || false,
          stats: {
            events: eventsData?.length || 0,
            followers: profile.followers_count || 0,
            following: profile.following_count || 0
          }
        };

        setUserData(structuredUserData);
        setEvents(eventsData || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading profile data</p>
      </div>
    );
  }

  const handleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleComment = (postId: number) => {
    // Handle comment submission
    console.log(`Commenting on post ${postId}: ${commentText}`);
    setCommentText("");
  };

  const handleVerificationImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVerificationImage(file);
      setVerificationImageUrl(URL.createObjectURL(file));
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationImage) {
      toast.error("Please upload a verification photo");
      return;
    }

    setIsSubmittingVerification(true);
    try {
      // Directly update the local state for presentation
      setUserData((prev: any) => ({
        ...prev,
        isVerified: true
      }));

      toast.success("Your account has been verified!");
      // Change the verification status in the database
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", userError);
        return;
      }

      // Update the verification status in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ isVerified: true })
        .eq('id', user?.id);

      setVerificationImage(null);
      setVerificationImageUrl("");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  const handleNextEvent = () => {
    if (currentEventIndex < events.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    }
  };

  const handlePrevEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Manage your personal information"
        icon={User}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="text-xl">
                {userData.initials}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{userData.name}</CardTitle>
            <CardDescription>{userData.role}</CardDescription>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">Member since {userData.joinDate}</Badge>
              {userData.isVerified ? (
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Shield className="h-4 w-4" />
                      Get Verified
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Verify Your Account</DialogTitle>
                      <DialogDescription>
                        Upload a photo of your valid ID to verify your account. This helps build trust in the community.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="verification-image">Verification Photo</Label>
                        <div className="flex flex-col items-center gap-4">
                          {verificationImageUrl ? (
                            <div className="relative w-full max-w-sm aspect-video">
                              <img
                                src={verificationImageUrl}
                                alt="Verification"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  setVerificationImage(null);
                                  setVerificationImageUrl("");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                <input
                                  id="verification-image"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleVerificationImageUpload}
                                />
                                <label
                                  htmlFor="verification-image"
                                  className="flex flex-col items-center gap-2 cursor-pointer"
                                >
                                  <Upload className="h-8 w-8 text-gray-400" />
                                  <span className="text-sm text-gray-500">
                                    Click to upload or drag and drop
                                  </span>
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleVerificationSubmit}
                        disabled={!verificationImage || isSubmittingVerification}
                      >
                        {isSubmittingVerification ? (
                          <>Submitting...</>
                        ) : (
                          <>Submit for Verification</>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold">{userData.stats.events}</p>
                  <p className="text-xs text-muted-foreground">Events</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{userData.stats.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{userData.stats.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4 text-left">
                <div>
                  <h3 className="text-sm font-medium mb-2">About</h3>
                  {isEditing ? (
                    <Textarea
                      defaultValue={userData.bio}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{userData.bio}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue={userData.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={userData.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue={userData.location} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{userData.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setIsEditing(false)} className="flex-1">
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          <Tabs
            defaultValue="events"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              {events.length > 0 ? (
                <div className="relative">
                  <Card>
                    <CardHeader>
                      <CardTitle>{events[currentEventIndex].title}</CardTitle>
                      <CardDescription>
                        {new Date(events[currentEventIndex].start_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                        <img
                          src={events[currentEventIndex].image_url || '/placeholder-event.jpg'}
                          alt={events[currentEventIndex].title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{events[currentEventIndex].start_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{events[currentEventIndex].location}</span>
                        </div>
                        <p className="text-muted-foreground mt-2">
                          {events[currentEventIndex].content}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {events[currentEventIndex].attendee_count} attendees
                        </Badge>
                        <Badge variant="secondary">
                          {events[currentEventIndex].capacity - events[currentEventIndex].attendee_count} spots left
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handlePrevEvent}
                          disabled={currentEventIndex === 0}
                        >
                          ←
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleNextEvent}
                          disabled={currentEventIndex === events.length - 1}
                        >
                          →
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No events created yet
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No saved items found
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
