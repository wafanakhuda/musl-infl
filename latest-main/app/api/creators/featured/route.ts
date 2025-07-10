
export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import  { apiClient } from "../../../../lib/api-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "6"

    const response = await apiClient.get(`/creators/featured?limit=${limit}`)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Failed to fetch featured creators:", error)
    return NextResponse.json({ error: "Failed to fetch featured creators" }, { status: 500 })
  }
}