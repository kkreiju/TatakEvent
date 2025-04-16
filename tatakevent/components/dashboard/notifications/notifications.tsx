"use client";

import * as React from "react";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  Tag,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Check,
  X,
  MoreHorizontal,
  Settings,
  Trash,
  Archive,
  Eye,
  EyeOff,
  Search,
  ChevronDown,
  BarChart2,
  MapPin,
} from "lucide-react";
import { PageHeader } from "../page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: "like",
    user: {
      name: "John Doe",
      avatar: "/avatars/john.jpg",
      initials: "JD",
    },
    content: "liked your post",
    post: {
      id: 101,
      content:
        "Just launched our new event platform! Check it out and let me know what you think.",
      image: "/images/event-platform.jpg",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: 2,
    type: "comment",
    user: {
      name: "Jane Smith",
      avatar: "/avatars/jane.jpg",
      initials: "JS",
    },
    content: "commented on your post",
    comment: "This looks amazing! Can't wait to try it out.",
    post: {
      id: 101,
      content:
        "Just launched our new event platform! Check it out and let me know what you think.",
      image: "/images/event-platform.jpg",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: 3,
    type: "follow",
    user: {
      name: "Alex Johnson",
      avatar: "/avatars/alex.jpg",
      initials: "AJ",
    },
    content: "started following you",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
  },
  {
    id: 4,
    type: "mention",
    user: {
      name: "Sarah Williams",
      avatar: "/avatars/sarah.jpg",
      initials: "SW",
    },
    content: "mentioned you in a post",
    post: {
      id: 102,
      content: "Hey @yourname, what do you think about this new feature?",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: 5,
    type: "event_invite",
    user: {
      name: "Event Team",
      avatar: "/avatars/event-team.jpg",
      initials: "ET",
    },
    content: "invited you to an event",
    event: {
      id: 201,
      title: "Community Meetup",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
      location: "San Francisco, CA",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: false,
  },
  {
    id: 6,
    type: "poll_result",
    user: {
      name: "Poll Results",
      avatar: "/avatars/poll.jpg",
      initials: "PR",
    },
    content: "Your poll has ended",
    poll: {
      id: 301,
      question: "What's your favorite event type?",
      results: [
        { option: "Conference", votes: 42, percentage: 35 },
        { option: "Workshop", votes: 38, percentage: 32 },
        { option: "Hackathon", votes: 25, percentage: 21 },
        { option: "Meetup", votes: 15, percentage: 12 },
      ],
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
  },
];

export function Notifications() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [notificationsList, setNotificationsList] =
    React.useState(notifications);

  const handleMarkAsRead = (id: number) => {
    setNotificationsList(
      notificationsList.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotificationsList(
      notificationsList.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id: number) => {
    setNotificationsList(notificationsList.filter((n) => n.id !== id));
  };

  const handleFilterChange = (type: string) => {
    if (filterType.includes(type)) {
      setFilterType(filterType.filter((t) => t !== type));
    } else {
      setFilterType([...filterType, type]);
    }
  };

  const filteredNotifications = notificationsList.filter((notification) => {
    // Filter by tab
    if (activeTab === "unread" && notification.read) {
      return false;
    }

    // Filter by type
    if (filterType.length > 0 && !filterType.includes(notification.type)) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const userName = notification.user.name.toLowerCase();
      const content = notification.content.toLowerCase();

      if (!userName.includes(query) && !content.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case "mention":
        return <Tag className="h-5 w-5 text-purple-500" />;
      case "event_invite":
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case "poll_result":
        return <BarChart2 className="h-5 w-5 text-indigo-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationContent = (notification: any) => {
    switch (notification.type) {
      case "like":
        return (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span>{" "}
              {notification.content}
            </p>
            {notification.post && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm line-clamp-2">
                  {notification.post.content}
                </p>
                {notification.post.image && (
                  <div className="mt-2 relative aspect-video rounded-md overflow-hidden">
                    <img
                      src={notification.post.image}
                      alt="Post image"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "comment":
        return (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span>{" "}
              {notification.content}
            </p>
            {notification.comment && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">{notification.comment}</p>
              </div>
            )}
            {notification.post && (
              <div className="bg-muted/50 p-3 rounded-md mt-2">
                <p className="text-sm line-clamp-2">
                  {notification.post.content}
                </p>
                {notification.post.image && (
                  <div className="mt-2 relative aspect-video rounded-md overflow-hidden">
                    <img
                      src={notification.post.image}
                      alt="Post image"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "follow":
        return (
          <p className="text-sm">
            <span className="font-medium">{notification.user.name}</span>{" "}
            {notification.content}
          </p>
        );
      case "mention":
        return (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span>{" "}
              {notification.content}
            </p>
            {notification.post && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">{notification.post.content}</p>
              </div>
            )}
          </div>
        );
      case "event_invite":
        return (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span>{" "}
              {notification.content}
            </p>
            {notification.event && (
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">{notification.event.title}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(notification.event.date, "MMM d, yyyy h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{notification.event.location}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button size="sm" variant="outline">
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      case "poll_result":
        return (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{notification.user.name}</span>{" "}
              {notification.content}
            </p>
            {notification.poll && (
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">{notification.poll.question}</p>
                <div className="space-y-2 mt-2">
                  {notification.poll.results.map(
                    (result: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{result.option}</span>
                          <span>{result.percentage}%</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${result.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with your activity"
        icon={Bell}
      />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filter Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                variant={filterType.includes("like") ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => handleFilterChange("like")}
              >
                <Heart className="h-4 w-4 mr-2" />
                Likes
              </Button>
              <Button
                variant={filterType.includes("comment") ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => handleFilterChange("comment")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Comments
              </Button>
              <Button
                variant={filterType.includes("follow") ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => handleFilterChange("follow")}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Follows
              </Button>
              <Button
                variant={filterType.includes("mention") ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => handleFilterChange("mention")}
              >
                <Tag className="h-4 w-4 mr-2" />
                Mentions
              </Button>
              <Button
                variant={
                  filterType.includes("event_invite") ? "default" : "outline"
                }
                size="sm"
                className="justify-start"
                onClick={() => handleFilterChange("event_invite")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
              <Button
                variant={
                  filterType.includes("poll_result") ? "default" : "outline"
                }
                size="sm"
                className="justify-start"
                onClick={() => handleFilterChange("poll_result")}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Polls
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterType([])}
            >
              Clear Filters
            </Button>
            <Button size="sm" onClick={() => setShowFilters(false)}>
              Apply
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 flex gap-4 ${
                      !notification.read ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={notification.user.avatar}
                          alt={notification.user.name}
                        />
                        <AvatarFallback>
                          {notification.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                            })}
                          </span>
                          {!notification.read && (
                            <Badge variant="default" className="h-5">
                              New
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as read
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteNotification(notification.id)
                              }
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Notification settings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {getNotificationContent(notification)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications found</p>
                {filterType.length > 0 && (
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => setFilterType([])}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
