"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../hooks/use-auth"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Send, Phone, Video, MoreVertical } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import io from "socket.io-client"

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://latestbackend-3psc.onrender.com")

interface Message {
  id: string
  content: string
  sender_id: string
  sender: {
    id: string
    full_name: string
    avatar_url?: string
  }
  created_at: string
}

interface RealTimeChatProps {
  conversationId: string
  recipientId: string
  recipientName: string
  recipientAvatar?: string
}

export function RealTimeChat({ conversationId, recipientId, recipientName, recipientAvatar }: RealTimeChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await res.json()
      setMessages(data)
    }

    fetchMessages()
    socket.emit("join", conversationId)

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.emit("leave", conversationId)
      socket.off("message")
    }
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    const payload = {
      conversationId,
      senderId: user.id,
      content: newMessage,
    }

    // Send to REST API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${conversationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: newMessage }),
    })

    const saved = await res.json()

    // Emit via WebSocket
    socket.emit("message", payload)

    setNewMessage("")
    setMessages((prev) => [...prev, saved])
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={recipientAvatar || "/placeholder.svg"} />
            <AvatarFallback>
              {recipientName.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{recipientName}</h3>
            <p className="text-sm text-muted-foreground">Connected</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm"><Phone className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm"><Video className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isOwn = msg.sender_id === user?.id
            return (
              <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                  {!isOwn && (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={msg.sender.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {msg.sender.full_name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-3 py-2 ${isOwn ? "bg-primary text-white" : "bg-muted"}`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? "text-white/70" : "text-muted-foreground"}`}>
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
