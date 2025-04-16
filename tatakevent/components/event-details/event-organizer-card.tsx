"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type EventOrganizerCardProps = {
  name: string
  image: string
  email: string
  isVerified: boolean
}

export default function EventOrganizerCard({ name, image, email, isVerified }: EventOrganizerCardProps) {
  const handleContactClick = () => {
    const subject = encodeURIComponent("Question about your event");
    const body = encodeURIComponent(`Hi ${name},\n\nI'm interested in your event and would like to know more about it.\n\nBest regards`);
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank', 'width=800,height=600,noopener,noreferrer');
  };

  console.log("IS VERIFIED", isVerified);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-background rounded-2xl border p-6 shadow-sm"
    >
      <h3 className="text-xl font-bold mb-4">Organizer</h3>

      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={image || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{name}</p>
            {isVerified && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 py-0 px-2">
                <CheckCircle className="h-3 w-3" />
                <span className="text-xs">Verified</span>
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="mt-4">
        <Button 
          variant="outline" 
          className="w-full group hover:bg-blue-50"
          onClick={handleContactClick}
        >
          <Mail className="mr-2 h-4 w-4 text-blue-600 group-hover:animate-bounce" />
          Contact Organizer
        </Button>
      </div>
    </motion.div>
  )
}
