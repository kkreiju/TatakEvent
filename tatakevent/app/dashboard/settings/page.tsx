import { Metadata } from "next";
import { SettingsForm } from "@/components/dashboard/settings/settings-form";

export const metadata: Metadata = {
  title: "Settings | Dashboard",
  description: "Manage your application settings and preferences.",
};

export default function SettingsPage() {
  return <SettingsForm />;
}
