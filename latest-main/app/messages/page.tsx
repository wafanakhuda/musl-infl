"use client"

import { useState, useEffect } from "react"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { ScrollArea } from "../../components/ui/scroll-area"
import { MessageCircle, Search, Users } from "lucide-react"
import { RealTimeChat } from "../../components/messaging/real-time-chat"

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar?: string
    type: "creator" | "brand"
  }
  lastMessage: string
  timestamp: string
  unread: number
  campaign?: string
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await res.json()
        setConversations(data)
      } catch (err) {
        console.error("Failed to load conversations", err)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.campaign?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => window.location.href = "/dashboard/creator"}
          className="text-white text-sm underline hover:text-primary"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-lg font-bold text-white flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Messages
        </h2>
        <Badge variant="secondary">
          {filteredConversations.reduce((acc, conv) => acc + conv.unread, 0)} unread
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <ScrollArea className="h-full">
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-slate-800 border border-slate-700"
                        : "hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white truncate">{conversation.participant.name}</h3>
                          <div className="flex items-center space-x-2">
                            {conversation.unread > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unread}
                              </Badge>
                            )}
                            <span className="text-xs text-slate-400">{conversation.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={conversation.participant.type === "creator" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {conversation.participant.type}
                          </Badge>
                          {conversation.campaign && (
                            <span className="text-xs text-slate-400 truncate">{conversation.campaign}</span>
                          )}
                        </div>

                        <p className="text-sm text-slate-400 truncate mt-1">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-slate-900/50 rounded-lg border border-slate-800">
          {selectedConversation && currentConversation ? (
            <RealTimeChat
              conversationId={selectedConversation}
              recipientId={currentConversation.participant.id}
              recipientName={currentConversation.participant.name}
              recipientAvatar={currentConversation.participant.avatar}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
