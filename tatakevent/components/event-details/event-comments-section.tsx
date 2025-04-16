"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

type Comment = {
  id: string
  name: string
  avatar: string
  date: string
  text: string
}

type EventCommentsSectionProps = {
  comments: Comment[]
  onCommentSubmit: (name: string, email: string, text: string) => void
}

export default function EventCommentsSection({ comments, onCommentSubmit }: EventCommentsSectionProps) {
  const [commentText, setCommentText] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !name.trim() || !email.trim()) return

    onCommentSubmit(name, email, commentText)
    setCommentText("")
    toast({
      title: "Comment posted!",
      description: "Your comment has been added to the discussion.",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <MessageCircle className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      {/* Comment form */}
      <div className="bg-muted/30 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold mb-4">Leave a comment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              Comment
            </label>
            <Textarea
              id="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts about this event..."
              rows={4}
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            Post Comment
          </Button>
        </form>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-background rounded-xl p-6 shadow-sm border">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.name} />
                <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">{comment.name}</h4>
                  <span className="text-xs text-muted-foreground">{comment.date}</span>
                </div>
                <p className="text-muted-foreground">{comment.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
