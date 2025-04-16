import { Metadata } from "next";
import { ProfileView } from "@/components/dashboard/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile | Dashboard",
  description: "Manage your profile and account settings.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
