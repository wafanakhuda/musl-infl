"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRealtimeMessages } from "../../hooks/use-realtime-messages"
import { useAuth } from "../../hooks/use-auth"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Send, Phone, Video, MoreVertical, Wifi, WifiOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ChatInterfaceProps {
  conversationId?: string
  onConversationSelect?: (conversationId: string) => void
}

export function ChatInterface({ conversationId, onConversationSelect }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, conversations, loading, sending, error, connectionStatus, sendMessage, createConversation } =
    useRealtimeMessages(conversationId)

  const currentConversation = conversations.find((c) => c.id === conversationId)
  const otherParticipant = currentConversation?.participants.find((p) => p.id !== user?.id)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending || !conversationId) return

    try {
      await sendMessage(newMessage)
      setNewMessage("")
      inputRef.current?.focus()
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p>Choose a conversation from the sidebar to start messaging</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Please log in</h3>
            <p>You need to be logged in to access messaging</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={otherParticipant?.avatar_url || "/placeholder.svg?height=40&width=40"} />
            <AvatarFallback>
              {otherParticipant?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{otherParticipant?.full_name || "Unknown User"}</h3>
            <div className="flex items-center space-x-2">
              <Badge variant={otherParticipant?.user_type === "creator" ? "default" : "secondary"}>
                {otherParticipant?.user_type || "User"}
              </Badge>
              {connectionStatus === "connected" ? (
                <div className="flex items-center text-xs text-green-600">
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </div>
              ) : (
                <div className="flex items-center text-xs text-red-600">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Disconnected
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Campaign Context */}
      {currentConversation?.campaign && (
        <div className="border-b p-3 bg-muted/50">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Campaign</Badge>
            <span className="text-sm font-medium">{currentConversation.campaign.title}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32 text-red-600">
            <div className="text-center">
              <p className="font-medium">Failed to load messages</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isOwn = message.sender_id === user?.id
              const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id
              const showTimestamp =
                index === messages.length - 1 ||
                messages[index + 1].sender_id !== message.sender_id ||
                new Date(messages[index + 1].created_at).getTime() - new Date(message.created_at).getTime() > 300000 // 5 minutes

              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    {!isOwn && showAvatar && (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={message.sender?.avatar_url || "/placeholder.svg?height=24&width=24"} />
                        <AvatarFallback className="text-xs">
                          {message.sender?.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {!isOwn && !showAvatar && <div className="w-6" />}

                    <div
                      className={`rounded-lg px-3 py-2 ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {showTimestamp && (
                        <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending || connectionStatus !== "connected"}
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || sending || connectionStatus !== "connected"} size="sm">
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        {connectionStatus !== "connected" && (
          <p className="text-xs text-muted-foreground mt-2">
            {connectionStatus === "connecting"
              ? "Connecting to messaging service..."
              : "Reconnecting to messaging service..."}
          </p>
        )}
      </div>
    </div>
  )
}
