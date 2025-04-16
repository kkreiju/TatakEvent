import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post | Dashboard",
  description: "Create a new post or content.",
};

export default function CreatePostPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Post</h2>
      </div>
      <div className="grid gap-4">{/* Create post form will go here */}</div>
    </div>
  );
}
