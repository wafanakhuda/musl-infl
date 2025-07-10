import axios from "axios"

const API_URL = "https://musliminfluencers.io/marketing/test/api"

export const databaseApi = {
  async getAudienceDemographics(userId: string) {
    const res = await axios.get(`${API_URL}/users/${userId}/audience-demographics`)
    return res.data
  },

  async getEngagementMetrics(userId: string) {
    const res = await axios.get(`${API_URL}/users/${userId}/engagement-metrics`)
    return res.data
  },

  async getTopCategories() {
    const res = await axios.get(`${API_URL}/top-categories`)
    return res.data
  },

  async createPayment(data: {
    campaign_id: string
    brand_id: string
    creator_id: string
    amount: number
    stripe_payment_intent_id: string
  }) {
    const res = await axios.post(`${API_URL}/payments`, data)
    return res.data
  },

  async updatePaymentStatus(paymentIntentId: string, status: "succeeded" | "failed") {
    const res = await axios.put(`${API_URL}/payments/${paymentIntentId}/status`, { status })
    return res.data
  }
}

// Optional alias
export { databaseApi as db }
