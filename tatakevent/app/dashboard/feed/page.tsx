import { Metadata } from "next";
import { Feed } from "@/components/dashboard/feed/feed";

export const metadata: Metadata = {
  title: "Feed | Dashboard",
  description: "View your feed and recent activities.",
};

export default function FeedPage() {
  return <Feed />;
}
