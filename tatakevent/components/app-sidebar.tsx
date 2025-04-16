"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bell,
  Command,
  GalleryVerticalEnd,
  Home,
  Star,
  PlusCircle,
  Settings2,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [fullName, setFullName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileURL, setProfileURL] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      // Get the session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      const userSessionEmail = session?.user?.email;

      if (userSessionEmail) {
        // Query the profiles table
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("email", userSessionEmail)
          .single();

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          return;
        }

        // Update details
        setFullName(profiles?.full_name || null);
        setUserEmail(profiles?.email || null);
        setProfileURL(profiles?.avatar_url || null);
      }
    };

    fetchUserData();
  }, [supabase]);

  // Navigation data
  const data = {
    user: {
      name: fullName || "Loading...",
      email: userEmail || "Loading...",
      avatar: profileURL || "/public/user-account.png",
    },
    teams: [
      {
        name: "TatakEvent",
        logo: Star,
        plan: "pinoy events",
      },
    ],
    navMain: [
      {
        title: "Events",
        url: "/dashboard/feed",
        icon: Home,
      },
      {
        title: "Create Post",
        url: "/dashboard/create-post",
        icon: PlusCircle,
      },
      {
        title: "Notification",
        url: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings2,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
