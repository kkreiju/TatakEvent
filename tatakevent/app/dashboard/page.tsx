import { Metadata } from "next";
import { Feed } from "@/components/dashboard/feed/feed";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard overview.",
};

export default function DashboardPage() {
  return <Feed />;
}
