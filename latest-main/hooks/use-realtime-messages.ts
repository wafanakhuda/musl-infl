"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { apiClient, type Message, type Conversation } from "../lib/api-client"
import { useAuth } from "./use-auth"
import { toast } from "sonner"

export function useRealtimeMessages(conversationId?: string) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")

  const fetchConversations = useCallback(async () => {
    if (!user?.id) return

    try {
      setError(null)
      const data = await apiClient.getConversations()
      setConversations(data)
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to fetch conversations"
      setError(errorMessage)
      console.error("Failed to fetch conversations:", err)
    }
  }, [user?.id])

  const fetchMessages = useCallback(
    async (convId: string) => {
      if (!convId || !user?.id) return

      try {
        setLoading(true)
        setError(null)
        const data = await apiClient.getMessages(convId)
        setMessages(data)
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to fetch messages"
        setError(errorMessage)
        console.error("Failed to fetch messages:", err)
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  const sendMessage = useCallback(
    async (content: string, convId?: string) => {
      const targetConversationId = convId || conversationId
      if (!targetConversationId || !content.trim() || !user?.id) return

      try {
        setSending(true)
        const newMessage = await apiClient.sendMessage(targetConversationId, content.trim())

        // Optimistically add message to UI
        setMessages((prev) => [...prev, newMessage])

        // Update conversation list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === targetConversationId
              ? { ...conv, last_message: newMessage, updated_at: new Date().toISOString() }
              : conv,
          ),
        )

        return newMessage
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to send message"
        toast.error(errorMessage)
        throw err
      } finally {
        setSending(false)
      }
    },
    [conversationId, user?.id],
  )

  const createConversation = useCallback(
    async (participantId: string, campaignId?: string) => {
      if (!user?.id) return

      try {
        const newConversation = await apiClient.createConversation(participantId, campaignId)
        setConversations((prev) => [newConversation, ...prev])
        return newConversation
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to create conversation"
        toast.error(errorMessage)
        throw err
      }
    },
    [user?.id],
  )

  const connectWebSocket = useCallback(() => {
    if (!user?.id) return

    const token = localStorage.getItem("access_token")
    if (!token) return

    // Use environment variable or fallback to localhost
    const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"
    const wsUrl = `${wsBaseUrl}/ws/messages?token=${token}`

    try {
      setConnectionStatus("connecting")
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log("WebSocket connected")
        setConnectionStatus("connected")
        setError(null)

        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          switch (data.type) {
            case "new_message":
              const message = data.message

              // Only add if not from current user (to avoid duplicates)
              if (message.sender_id !== user.id) {
                setMessages((prev) => {
                  // Avoid duplicates
                  if (prev.some((m) => m.id === message.id)) return prev
                  return [...prev, message]
                })

                // Update conversation list
                setConversations((prev) =>
                  prev.map((conv) =>
                    conv.id === message.conversation_id
                      ? {
                          ...conv,
                          last_message: message,
                          unread_count: conv.unread_count + 1,
                          updated_at: new Date().toISOString(),
                        }
                      : conv,
                  ),
                )

                // Show notification for messages from others
                toast.success("New Message", {
                  description: `${message.sender?.full_name}: ${message.content.substring(0, 50)}${message.content.length > 50 ? "..." : ""}`,
                })
              }
              break

            case "conversation_updated":
              setConversations((prev) =>
                prev.map((conv) => (conv.id === data.conversation.id ? data.conversation : conv)),
              )
              break

            case "user_online":
              // Handle user online status
              console.log("User came online:", data.user_id)
              break

            case "user_offline":
              // Handle user offline status
              console.log("User went offline:", data.user_id)
              break

            case "typing":
              // Handle typing indicators if needed
              console.log("User typing:", data.user_id, data.conversation_id)
              break
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error)
        setConnectionStatus("disconnected")
        setError("Connection error. Retrying...")
      }

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason)
        setConnectionStatus("disconnected")

        // Attempt to reconnect after 3 seconds if not a normal closure
        if (event.code !== 1000 && user?.id) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect WebSocket...")
            connectWebSocket()
          }, 3000)
        }
      }
    } catch (error) {
      console.error("Failed to connect WebSocket:", error)
      setConnectionStatus("disconnected")
      setError("Failed to connect to real-time messaging")
    }
  }, [user?.id])

  // Initialize WebSocket connection
  useEffect(() => {
    if (user?.id) {
      connectWebSocket()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting")
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [user?.id, connectWebSocket])

  // Fetch conversations on mount
  useEffect(() => {
    if (user?.id) {
      fetchConversations()
    }
  }, [user?.id, fetchConversations])

  // Fetch messages when conversation changes
  useEffect(() => {
    if (conversationId && user?.id) {
      fetchMessages(conversationId)
    }
  }, [conversationId, user?.id, fetchMessages])

  return {
    messages,
    conversations,
    loading,
    sending,
    error,
    connectionStatus,
    sendMessage,
    createConversation,
    refetchConversations: fetchConversations,
    refetchMessages: () => conversationId && fetchMessages(conversationId),
  }
}