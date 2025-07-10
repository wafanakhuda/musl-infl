"use client"

import { TEST_CREDENTIALS } from "./env-fallback"

// Mock data storage (using localStorage for persistence)
class MockStorage {
  private getItem(key: string) {
    if (typeof window === "undefined") return null
    return localStorage.getItem(`halal_marketplace_${key}`)
  }

  private setItem(key: string, value: any) {
    if (typeof window === "undefined") return
    localStorage.setItem(`halal_marketplace_${key}`, JSON.stringify(value))
  }

  private getArray(key: string) {
    const data = this.getItem(key)
    return data ? JSON.parse(data) : []
  }

  private setArray(key: string, value: any[]) {
    this.setItem(key, value)
  }

  // Users
  getUsers() {
    return this.getArray("users")
  }

  setUsers(users: any[]) {
    this.setArray("users", users)
  }

  // Campaigns
  getCampaigns() {
    return this.getArray("campaigns")
  }

  setCampaigns(campaigns: any[]) {
    this.setArray("campaigns", campaigns)
  }

  // Messages
  getMessages() {
    return this.getArray("messages")
  }

  setMessages(messages: any[]) {
    this.setArray("messages", messages)
  }

  // Current user
  getCurrentUser() {
    const data = this.getItem("current_user")
    return data ? JSON.parse(data) : null
  }

  setCurrentUser(user: any) {
    this.setItem("current_user", user)
  }

  // Auth token
  getToken() {
    return this.getItem("auth_token")
  }

  setToken(token: string) {
    this.setItem("auth_token", token)
  }
}

const storage = new MockStorage()

// Initialize mock data
const initializeMockData = () => {
  if (storage.getUsers().length === 0) {
    // Create test users
    const testUsers = [
      {
        id: "creator-1",
        email: "creator@test.com",
        full_name: "Ahmed Hassan",
        user_type: "creator",
        avatar_url: "/placeholder.svg?height=100&width=100",
        bio: "Islamic lifestyle content creator passionate about halal living and modest fashion.",
        location: "Dubai, UAE",
        website: "https://ahmedhassan.com",
        verified: true,
        email_verified: true,
        is_active: true,
        created_at: new Date().toISOString(),
        profile: {
          niche: "Islamic Lifestyle",
          followers: 125000,
          engagement_rate: 4.2,
          platforms: ["Instagram", "TikTok", "YouTube"],
        },
      },
      {
        id: "brand-1",
        email: "brand@test.com",
        full_name: "Halal Foods Co",
        user_type: "brand",
        avatar_url: "/placeholder.svg?height=100&width=100",
        bio: "Premium halal food products for the modern Muslim family.",
        location: "London, UK",
        website: "https://halalfoodsco.com",
        verified: true,
        email_verified: true,
        is_active: true,
        created_at: new Date().toISOString(),
        profile: {
          company_name: "Halal Foods Co",
          industry: "Food & Beverage",
          company_size: "50-100 employees",
        },
      },
      {
        id: "creator-2",
        email: "fatima@test.com",
        full_name: "Fatima Al-Zahra",
        user_type: "creator",
        avatar_url: "/placeholder.svg?height=100&width=100",
        bio: "Modest fashion influencer and Islamic parenting coach.",
        location: "Toronto, Canada",
        website: "https://fatimaalzahra.com",
        verified: true,
        email_verified: true,
        is_active: true,
        created_at: new Date().toISOString(),
        profile: {
          niche: "Modest Fashion",
          followers: 89000,
          engagement_rate: 5.1,
          platforms: ["Instagram", "Pinterest", "Blog"],
        },
      },
      {
        id: "creator-3",
        email: "omar@test.com",
        full_name: "Omar Abdullah",
        user_type: "creator",
        avatar_url: "/placeholder.svg?height=100&width=100",
        bio: "Tech entrepreneur sharing Islamic finance and halal investment tips.",
        location: "Kuala Lumpur, Malaysia",
        website: "https://omarabdullah.com",
        verified: false,
        email_verified: true,
        is_active: true,
        created_at: new Date().toISOString(),
        profile: {
          niche: "Islamic Finance",
          followers: 45000,
          engagement_rate: 3.8,
          platforms: ["LinkedIn", "YouTube", "Twitter"],
        },
      },
    ]

    storage.setUsers(testUsers)

    // Create test campaigns
    const testCampaigns = [
      {
        id: "campaign-1",
        title: "Ramadan Recipe Collection",
        description:
          "Looking for Muslim food creators to showcase traditional Ramadan recipes using our halal ingredients. Perfect for creators who focus on Islamic cooking and family meals.",
        category: "Food & Beverage",
        campaign_type: ["Instagram Posts", "Recipe Videos", "Stories"],
        budget_min: 500,
        budget_max: 2000,
        start_date: "2024-03-01",
        end_date: "2024-04-15",
        target_audience: ["Muslim Families", "Food Enthusiasts", "Ramadan Observers"],
        requirements: "Must be a practicing Muslim, have experience with halal cooking, minimum 10K followers",
        deliverables: ["3 Instagram posts", "5 Stories", "1 Reel recipe video"],
        status: "active",
        applications_count: 12,
        created_at: new Date().toISOString(),
        brand: {
          id: "brand-1",
          full_name: "Halal Foods Co",
          avatar_url: "/placeholder.svg?height=50&width=50",
        },
      },
      {
        id: "campaign-2",
        title: "Modest Fashion Spring Collection",
        description:
          "Seeking modest fashion influencers to showcase our new spring hijab and abaya collection. Looking for creators who embody Islamic values and modest style.",
        category: "Fashion & Beauty",
        campaign_type: ["Instagram Posts", "TikTok Videos", "Stories"],
        budget_min: 800,
        budget_max: 3000,
        start_date: "2024-02-15",
        end_date: "2024-05-30",
        target_audience: ["Muslim Women", "Modest Fashion Enthusiasts", "Hijabi Community"],
        requirements: "Muslim women who wear hijab, minimum 25K followers, focus on modest fashion",
        deliverables: ["4 Instagram posts", "2 TikTok videos", "10 Stories", "1 IGTV styling video"],
        status: "active",
        applications_count: 8,
        created_at: new Date().toISOString(),
        brand: {
          id: "brand-2",
          full_name: "Modest Couture",
          avatar_url: "/placeholder.svg?height=50&width=50",
        },
      },
      {
        id: "campaign-3",
        title: "Islamic Finance Education Series",
        description:
          "Partner with us to educate the Muslim community about halal investment options and Islamic banking principles. Perfect for finance-focused creators.",
        category: "Finance & Education",
        campaign_type: ["YouTube Videos", "LinkedIn Posts", "Blog Posts"],
        budget_min: 1000,
        budget_max: 5000,
        start_date: "2024-01-01",
        end_date: "2024-06-30",
        target_audience: ["Muslim Professionals", "Islamic Finance Students", "Halal Investors"],
        requirements: "Knowledge of Islamic finance, professional background, minimum 15K followers",
        deliverables: ["2 YouTube videos", "5 LinkedIn posts", "1 detailed blog post"],
        status: "active",
        applications_count: 5,
        created_at: new Date().toISOString(),
        brand: {
          id: "brand-3",
          full_name: "Islamic Investment Bank",
          avatar_url: "/placeholder.svg?height=50&width=50",
        },
      },
    ]

    storage.setCampaigns(testCampaigns)
  }
}

// Mock API implementation
export const mockApi = {
  // Initialize data on first load
  init: () => {
    initializeMockData()
  },

  // Auth endpoints
  async register(userData: {
    email: string
    password: string
    full_name: string
    user_type: "creator" | "brand"
    company_name?: string
    niche?: string
  }) {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    const users = storage.getUsers()
    const existingUser = users.find((u: any) => u.email === userData.email)

    if (existingUser) {
      throw new Error("User already exists")
    }

    const newUser = {
      id: `${userData.user_type}-${Date.now()}`,
      email: userData.email,
      full_name: userData.full_name,
      user_type: userData.user_type,
      avatar_url: `/placeholder.svg?height=100&width=100&query=${userData.user_type}+avatar`,
      bio: "",
      location: "",
      website: "",
      verified: false,
      email_verified: true, // Auto-verify for demo
      is_active: true,
      created_at: new Date().toISOString(),
      profile: userData.user_type === "creator" ? { niche: userData.niche } : { company_name: userData.company_name },
    }

    users.push(newUser)
    storage.setUsers(users)

    return newUser
  },

  async login(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network delay

    const users = storage.getUsers()
    let user = users.find((u: any) => u.email === email)

    // If user doesn't exist, check test credentials
    if (!user) {
      const testCred = Object.values(TEST_CREDENTIALS).find((cred) => cred.email === email)
      if (testCred) {
        // Create user from test credentials
        user = {
          id: `${testCred.user_type}-test`,
          email: testCred.email,
          full_name: testCred.full_name,
          user_type: testCred.user_type,
          avatar_url: `/placeholder.svg?height=100&width=100&query=${testCred.user_type}+avatar`,
          bio: `Test ${testCred.user_type} account for demo purposes`,
          location: "Test Location",
          website: "",
          verified: true,
          email_verified: true,
          is_active: true,
          created_at: new Date().toISOString(),
          profile: {},
        }
        users.push(user)
        storage.setUsers(users)
      }
    }

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const token = `mock_token_${user.id}_${Date.now()}`
    storage.setToken(token)
    storage.setCurrentUser(user)

    return {
      access_token: token,
      token_type: "bearer",
      user_type: user.user_type,
      user_id: user.id,
      email_verified: user.email_verified,
    }
  },

  async getCurrentUser(token: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const currentUser = storage.getCurrentUser()
    if (!currentUser || !token) {
      throw new Error("Not authenticated")
    }

    return currentUser
  },

  // Campaign endpoints
  async getCampaigns(filters?: any) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let campaigns = storage.getCampaigns()

    // Apply filters
    if (filters?.search) {
      campaigns = campaigns.filter(
        (c: any) =>
          c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          c.description.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters?.category) {
      campaigns = campaigns.filter((c: any) => c.category === filters.category)
    }

    return campaigns
  },

  // Creator endpoints
  async getCreators(filters?: any) {
    await new Promise((resolve) => setTimeout(resolve, 400))

    let creators = storage.getUsers().filter((u: any) => u.user_type === "creator")

    // Apply filters
    if (filters?.search) {
      creators = creators.filter(
        (c: any) =>
          c.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
          c.bio.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters?.niche) {
      creators = creators.filter((c: any) => c.profile?.niche?.includes(filters.niche))
    }

    if (filters?.verified_only) {
      creators = creators.filter((c: any) => c.verified)
    }

    return creators
  },

  // Dashboard endpoints
  async getDashboardStats(token: string) {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const currentUser = storage.getCurrentUser()
    if (!currentUser) {
      throw new Error("Not authenticated")
    }

    if (currentUser.user_type === "creator") {
      return {
        total_campaigns: 12,
        active_campaigns: 3,
        completed_campaigns: 8,
        pending_applications: 2,
        total_earnings: 15750,
        this_month_earnings: 3200,
        followers_growth: 8.5,
        engagement_rate: 4.2,
        recent_activities: [
          { type: "application", message: "Applied to Ramadan Recipe Collection", date: "2024-01-15" },
          { type: "campaign", message: "Completed Modest Fashion Winter Campaign", date: "2024-01-12" },
          { type: "payment", message: "Received payment of $1,200", date: "2024-01-10" },
        ],
      }
    } else {
      return {
        total_campaigns: 5,
        active_campaigns: 3,
        completed_campaigns: 2,
        total_applications: 25,
        approved_applications: 8,
        total_spent: 12500,
        this_month_spent: 4200,
        avg_campaign_performance: 85,
        recent_activities: [
          { type: "application", message: "New application for Spring Collection", date: "2024-01-15" },
          { type: "campaign", message: "Launched Ramadan Recipe Collection", date: "2024-01-12" },
          { type: "payment", message: "Paid $2,000 to Ahmed Hassan", date: "2024-01-10" },
        ],
      }
    }
  },
}

// Initialize mock data when module loads
if (typeof window !== "undefined") {
  mockApi.init()
}
