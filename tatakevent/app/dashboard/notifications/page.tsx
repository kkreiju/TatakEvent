import { Metadata } from "next";
import { NotificationsList } from "@/components/dashboard/notifications/notifications-list";

export const metadata: Metadata = {
  title: "Notifications | Dashboard",
  description: "View your notifications and alerts.",
};

export default function NotificationsPage() {
  return <NotificationsList />;
}
