"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, X, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { marked } from "marked"
import DOMPurify from "dompurify"
import { useMediaQuery } from "@/hooks/use-mobile"
import dotenv from "dotenv"

dotenv.config()

function sanitizeHtml(html: string): string {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["ul", "li", "br"],
    ALLOWED_ATTR: [],
  })
  return sanitizedHtml
}

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; username?: string }[]>([
    { text: "Hi there! How can I assist you today?", isUser: false },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    setInputValue("")

    // Add user message
    setMessages([...messages, { text: inputValue, isUser: true, username: "You" }])
    let output = marked.parse(inputValue)

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "",
          messages: [
            {
              role: "system",
              content: process.env.NEXT_PUBLIC_OPENROUTER_SYSTEM_CONTENT || "",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: inputValue,
                },
              ],
            },
          ],
        }),
      })

      const data = await response.json()
      const markdownText = data.choices?.[0]?.message?.content || "Server is busy, please try again later."
      output = sanitizeHtml(marked.parse(markdownText).toString())
    } catch (error) {
      console.error("Error: " + error)
    }

    // Simulate bot response with typing indicator
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: output.toString(),
          isUser: false,
        },
      ])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="relative">
      {/* Chat toggle button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center justify-center">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-105",
          )}
          style={{
            backgroundColor: "#1565C0",
            color: "#ffffff",
          }}
          aria-label={isChatOpen ? "Close chat" : "Open chat"}
        >
          {isChatOpen ? (
            <X style={{ width: "20px", height: "20px" }} />
          ) : (
            <Bot style={{ width: "20px", height: "20px" }} />
          )}
        </Button>
      </div>

      {/* Chat window */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300 transform shadow-2xl overflow-hidden",
          isChatOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          isMobile
            ? "inset-0 rounded-none" // Full screen on mobile
            : "bottom-24 right-6 w-full max-w-sm rounded-2xl translate-y-0", // Normal size on desktop
        )}
        style={{
          backgroundColor: "#0f172a", // Solid dark background
          color: "#ffffff",
          border: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
          transform: isChatOpen ? "translateY(0)" : "translateY(8px)",
        }}
      >
        {/* Chat header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{
            backgroundColor: "#1e293b", // Darker header
            color: "#ffffff",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-emerald-600">
              <AvatarFallback className="text-white">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">Chat Assistant</h3>
              <p className="text-xs flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span> Online
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsChatOpen(false)}
            className="h-10 w-10 rounded-full hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Chat messages */}
        <div
          className={cn("overflow-y-auto p-4", isMobile ? "h-[calc(100vh-132px)]" : "h-80")}
          style={{ backgroundColor: "#0f172a" }}
        >
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"} items-end gap-2`}>
                {!message.isUser && (
                  <Avatar className="h-8 w-8 flex-shrink-0 bg-emerald-600">
                    <AvatarFallback className="text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl p-3 shadow-md",
                    message.isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800 text-white rounded-bl-none border border-slate-700",
                  )}
                  dangerouslySetInnerHTML={{
                    __html: message.text.replace(/\n/g, "<br>"),
                  }}
                ></div>

                {message.isUser && (
                  <div className="flex flex-col items-end gap-1">
                    {message.username && <span className="text-xs text-blue-400">{message.username}</span>}
                    <Avatar className="h-8 w-8 flex-shrink-0 bg-blue-700">
                      <AvatarFallback className="text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-slate-700" style={{ backgroundColor: "#0f172a" }}>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-full bg-slate-800 border-slate-700 text-white h-12"
            />
            <Button
              onClick={handleSendMessage}
              className="rounded-full h-12 w-12 p-0 hover:bg-blue-700 transition-colors bg-blue-600"
              disabled={!inputValue.trim()}
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
