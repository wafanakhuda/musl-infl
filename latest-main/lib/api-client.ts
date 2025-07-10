"use client"

import axios, { type AxiosInstance } from "axios"

// Interfaces
export interface LoginResponse {
  access_token: string
  token_type: string
  user_type: string
  user_id: string
  email_verified: boolean
}

export interface User {
  id: string
  email: string
  full_name: string
  user_type: "creator" | "brand" | "admin"
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  verified: boolean
  email_verified: boolean
  is_active: boolean
  created_at: string
  profile?: any
  last_login?: string | null
  followers?: number
  price_min?: number
  price_max?: number
  platforms?: string[]
  niche?: string
}

export interface AdminUser extends User {
  last_login: string | null
}

export interface Campaign {
  id: string
  title: string
  description: string
  category: string
  campaign_type: string[]
  budget_min: number
  budget_max: number
  start_date?: string
  end_date?: string
  target_audience: string[]
  deadline: string
  requirements?: string
  deliverables: string[]
  status: "draft" | "active" | "paused" | "completed" | "cancelled"
  applications_count: number
  created_at: string
  brand: {
    id: string
    full_name: string
    avatar_url?: string
    email?: string
  }
}

export interface AdminCampaign extends Campaign {
  brand: {
    id: string
    full_name: string
    avatar_url?: string
    email: string
  }
}

export interface Message {
  id: string
  content: string
  sender_id: string
  conversation_id: string
  created_at: string
  read_at?: string
  sender?: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

export interface Conversation {
  id: string
  participants: Array<{
    id: string
    full_name: string
    avatar_url?: string
    user_type: string
  }>
  last_message?: Message
  unread_count: number
  created_at: string
  updated_at: string
  campaign?: {
    id: string
    title: string
  }
}

export interface EarningsData {
  month: string
  amount: number
}

export type ModerateAction = "approve" | "reject" | "flag"

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || "/api"
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: { "Content-Type": "application/json" },
    })

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    }, Promise.reject)

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.clearToken()
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token")
            window.location.href = "/auth/login"
          }
        }
        return Promise.reject(error)
      },
    )

    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("access_token")
      if (savedToken) this.setToken(savedToken)
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") localStorage.setItem("access_token", token)
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") localStorage.removeItem("access_token")
  }

  get = <T = any>(url: string) => this.client.get<T>(url).then(res => res.data)

  async register(userData: Partial<User>): Promise<User> {
    const res = await this.client.post("/auth/register", userData)
    return res.data
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await this.client.post("/auth/login", { email, password })
    return res.data
  }

  async getCurrentUser(): Promise<User> {
    const res = await this.client.get("/users/me")
    return res.data
  }

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData()
    formData.append("file", file)
    const res = await this.client.post("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const res = await this.client.put("/users/me", userData)
    return res.data
  }

  async getCreators(filters?: any): Promise<User[]> {
    const res = await this.client.get("/creators", { params: filters })
    return res.data
  }

  async getCampaigns(filters?: any): Promise<Campaign[]> {
    const res = await this.client.get("/campaigns", { params: filters })
    return res.data
  }

  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    const res = await this.client.post("/campaigns", data)
    return res.data
  }

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    const res = await this.client.put(`/campaigns/${id}`, data)
    return res.data
  }

  async deleteCampaign(id: string): Promise<void> {
    await this.client.delete(`/campaigns/${id}`)
  }

  async getCampaign(id: string): Promise<Campaign> {
    const res = await this.client.get(`/campaigns/${id}`)
    return res.data
  }

  async applyToCampaign(id: string, data: any) {
    const res = await this.client.post(`/campaigns/${id}/apply`, data)
    return res.data
  }

  async uploadPortfolioItem(file: File, name: string): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", name)
    const res = await this.client.post("/portfolio/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  }

  async getCreatorPortfolio(userId: string): Promise<{ portfolio_items: any[] }> {
    const res = await this.client.get("/portfolio", { params: { userId } })
    return res.data
  }

  async createPortfolioItem(data: any): Promise<any> {
    const res = await this.client.post("/portfolio", data)
    return res.data
  }

  async updatePortfolioItem(id: string, data: any): Promise<any> {
    const res = await this.client.put(`/portfolio/${id}`, data)
    return res.data
  }

  async deletePortfolioItem(id: string): Promise<void> {
    await this.client.delete(`/portfolio/${id}`)
  }

  async getDashboardStats(): Promise<any> {
    const res = await this.client.get("/dashboard/stats")
    return res.data
  }

  async getEarningsData(p0: string): Promise<EarningsData[]> {
    const res = await this.client.get("/dashboard/earnings")
    return res.data
  }

  async getConversations(): Promise<Conversation[]> {
    const res = await this.client.get("/messages/conversations")
    return res.data
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await this.client.get(`/messages/${conversationId}`)
    return res.data
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const res = await this.client.post(`/messages/${conversationId}`, { content })
    return res.data
  }

  async createConversation(recipientId: string, campaignId?: string): Promise<Conversation> {
    const res = await this.client.post(`/messages/start`, { recipientId, campaignId })
    return res.data
  }

  async getSearchSuggestions(type: "creators" | "campaigns", query: string): Promise<{ suggestions: string[] }> {
    const res = await this.client.get(`/search/suggestions`, { params: { type, q: query } })
    return res.data
  }

  async searchCreators(params: any): Promise<{ results: User[]; total_count: number }> {
    const res = await this.client.get(`/search/creators`, { params })
    return res.data
  }

  async searchCampaigns(params: any): Promise<{ results: Campaign[]; total_count: number }> {
    const res = await this.client.get(`/search/campaigns`, { params })
    return res.data
  }

  async trackSearchEvent(data: any): Promise<void> {
    await this.client.post("/search/track", data)
  }

  async getAnalytics(): Promise<any> {
    const res = await this.client.get("/analytics")
    return res.data
  }

  async verifyUser(userId: string, verified: boolean): Promise<{ message: string }> {
    const res = await this.client.post(`/admin/users/${userId}/verify`, { verified })
    return res.data
  }

  async suspendUser(userId: string, reason: string): Promise<{ message: string }> {
    const res = await this.client.post(`/admin/users/${userId}/suspend`, { reason })
    return res.data
  }

  async moderateCampaign(id: string, action: ModerateAction, reason: string): Promise<{ message: string }> {
    const res = await this.client.post(`/admin/campaigns/${id}/moderate`, { action, reason })
    return res.data
  }

  async getAdminDashboard(): Promise<any> {
    const res = await this.client.get("/admin/dashboard")
    return res.data
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    const res = await this.client.get("/admin/users")
    return res.data.map((user: any) => ({
      ...user,
      last_login: user.last_login ?? null,
    }))
  }

  async getAdminCampaigns(): Promise<AdminCampaign[]> {
    const res = await this.client.get("/admin/campaigns")
    return res.data.map((c: any) => ({
      ...c,
      brand: {
        ...c.brand,
        email: c.brand.email ?? "",
      },
    }))
  }
}

export const apiClient = new ApiClient()
