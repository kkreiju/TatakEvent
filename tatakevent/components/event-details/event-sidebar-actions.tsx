"use client";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Facebook, Twitter, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ShareData = {
  url: string;
  title: string;
  text: string;
};

export default function EventSidebarActions() {
  const { toast } = useToast();

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to clipboard.",
    });
  };

  const shareToSocial = (platform: 'facebook' | 'twitter' | 'instagram') => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent("Check out this awesome event!");

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'instagram':
        // Since Instagram doesn't have a direct share URL, we'll copy to clipboard and show instructions
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Ready to share on Instagram!",
          description: "Link copied. Open Instagram and paste in your story or post.",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "Check out this awesome event!",
          url: window.location.href,
        });
        toast({
          title: "Shared successfully!",
          description: "Thank you for sharing this event.",
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <Button className="w-full bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
        Register Now
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full group" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Share Event
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this event</DialogTitle>
            <DialogDescription>
              Share this event with your friends and colleagues
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Input
                readOnly
                value={
                  typeof window !== "undefined" ? window.location.href : ""
                }
              />
            </div>
            <Button size="sm" className="px-3" onClick={copyToClipboard}>
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Share on social media</h4>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-blue-50"
                onClick={() => shareToSocial('facebook')}
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-blue-50"
                onClick={() => shareToSocial('twitter')}
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-pink-50"
                onClick={() => shareToSocial('instagram')}
              >
                <Instagram className="h-4 w-4 text-pink-600" />
                <span className="sr-only">Share on Instagram</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
