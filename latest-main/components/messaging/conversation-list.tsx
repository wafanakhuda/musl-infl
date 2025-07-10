"use client"

import { useRealtimeMessages } from "../../hooks/use-realtime-messages"
import { useAuth } from "../../hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Search, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

interface ConversationListProps {
  selectedConversationId?: string
  onConversationSelect: (conversationId: string) => void
  onNewConversation?: () => void
}

export function ConversationList({
  selectedConversationId,
  onConversationSelect,
  onNewConversation,
}: ConversationListProps) {
  const { user } = useAuth()
  const { conversations, loading, error } = useRealtimeMessages()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find((p) => p.id !== user?.id)
    return (
      otherParticipant?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.campaign?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-4">
        <div className="text-center">
          <p className="font-medium">Please log in</p>
          <p className="text-sm">You need to be logged in to access messaging</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-600 p-4">
        <div className="text-center">
          <p className="font-medium">Failed to load conversations</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Messages</h2>
          {onNewConversation && (
            <Button variant="ghost" size="sm" onClick={onNewConversation}>
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No conversations found</p>
            {searchQuery && <p className="text-sm">Try adjusting your search</p>}
            {!searchQuery && <p className="text-sm">Start a conversation with a creator or brand</p>}
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find((p) => p.id !== user?.id)
              const isSelected = conversation.id === selectedConversationId

              return (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${isSelected ? "bg-muted" : ""}`}
                  onClick={() => onConversationSelect(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={otherParticipant?.avatar_url || "/placeholder.svg?height=40&width=40"} />
                        <AvatarFallback>
                          {otherParticipant?.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-medium truncate ${
                            conversation.unread_count > 0 ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {otherParticipant?.full_name || "Unknown User"}
                        </h3>
                        {conversation.last_message && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mb-1">
                        <Badge
                          variant={otherParticipant?.user_type === "creator" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {otherParticipant?.user_type || "User"}
                        </Badge>
                        {conversation.campaign && (
                          <Badge variant="outline" className="text-xs">
                            Campaign
                          </Badge>
                        )}
                      </div>

                      {conversation.campaign && (
                        <p className="text-xs text-muted-foreground mb-1 truncate">{conversation.campaign.title}</p>
                      )}

                      {conversation.last_message && (
                        <p
                          className={`text-sm truncate ${
                            conversation.unread_count > 0 ? "font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {conversation.last_message.sender_id === user?.id ? "You: " : ""}
                          {conversation.last_message.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
