"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { PageHeader } from "../page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: "mention",
    title: "John Doe mentioned you",
    content: "Hey, can you review this event proposal?",
    timestamp: "5 minutes ago",
    read: false,
    avatar: "/avatars/john.jpg",
    initials: "JD",
  },
  {
    id: 2,
    type: "like",
    title: "Jane Smith liked your post",
    content: "Your post about event management was really helpful!",
    timestamp: "1 hour ago",
    read: false,
    avatar: "/avatars/jane.jpg",
    initials: "JS",
  },
  {
    id: 3,
    type: "comment",
    title: "Alex Johnson commented on your post",
    content:
      "Great insights! Have you considered adding a feature for virtual events?",
    timestamp: "3 hours ago",
    read: true,
    avatar: "/avatars/alex.jpg",
    initials: "AJ",
  },
  {
    id: 4,
    type: "system",
    title: "System Update",
    content: "Your account has been successfully verified.",
    timestamp: "1 day ago",
    read: true,
    avatar: "/avatars/system.jpg",
    initials: "S",
  },
];

export function NotificationsList() {
  const [activeTab, setActiveTab] = React.useState("all");

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread") return notifications.filter((n) => !n.read);
    return notifications;
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with your team's activities"
        icon={Bell}
      />

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No notifications found
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={notification.read ? "opacity-70" : ""}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={notification.avatar}
                      alt={notification.title}
                    />
                    <AvatarFallback>{notification.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {notification.title}
                      </CardTitle>
                      <Badge
                        variant={notification.read ? "outline" : "default"}
                      >
                        {notification.read ? "Read" : "New"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{notification.content}</p>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm">
                      {notification.read ? "Mark as unread" : "Mark as read"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
