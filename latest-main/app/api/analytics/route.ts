
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"

export async function GET() {
  // Mock analytics data for static export
  const mockData = {
    funnels: {
      registration: {
        steps: [
          { name: "Landing Page", visitors: 1000, conversion: 100 },
          { name: "Sign Up Form", visitors: 300, conversion: 30 },
          { name: "Email Verification", visitors: 250, conversion: 25 },
          { name: "Profile Complete", visitors: 200, conversion: 20 },
        ],
      },
      campaign_creation: {
        steps: [
          { name: "Dashboard", visitors: 500, conversion: 100 },
          { name: "Create Campaign", visitors: 150, conversion: 30 },
          { name: "Campaign Details", visitors: 120, conversion: 24 },
          { name: "Published", visitors: 100, conversion: 20 },
        ],
      },
    },
    summary: {
      total_users: 1250,
      active_campaigns: 45,
      completed_collaborations: 128,
      revenue_this_month: 15420,
    },
  }

  return NextResponse.json(mockData)
}
