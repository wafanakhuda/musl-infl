export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get("days") || "30"

    // Call backend analytics service
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard?days=${days}`, {
      headers: {
        Authorization: `Bearer ${process.env.ANALYTICS_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch analytics data")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Analytics dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
