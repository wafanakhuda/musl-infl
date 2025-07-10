
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In production, this would fetch from your actual database
    // For now, return realistic stats that would come from your backend
    const stats = {
      total_creators: 1250,
      total_brands: 340,
      total_campaigns: 890,
      total_revenue: 2500000,
      active_campaigns: 156,
      verified_creators: 980,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch platform stats:", error)
    return NextResponse.json({ error: "Failed to fetch platform stats" }, { status: 500 })
  }
}
