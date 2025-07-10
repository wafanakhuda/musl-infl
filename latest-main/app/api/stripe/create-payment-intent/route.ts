
export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { createPaymentIntent } from "../../../../lib/stripe"
import { db } from "../../../../lib/database-api"

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("placeholder")) {
      return NextResponse.json(
        {
          error: "Payment processing not configured",
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    const { amount, campaignId, brandId, creatorId } = body

    if (!amount || !campaignId || !brandId || !creatorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(amount, "usd", {
      campaign_id: campaignId,
      brand_id: brandId,
      creator_id: creatorId,
    })

    // Store payment in database (if database is available)
    try {
      await db.createPayment({
        campaign_id: campaignId,
        brand_id: brandId,
        creator_id: creatorId,
        amount: Math.round(amount * 100), // Store in cents
        stripe_payment_intent_id: paymentIntent.id,
      })
    } catch (dbError) {
      console.warn("Database not available:", dbError)
      // Continue without database for static build
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}

// For static export, we need to export a GET method too
export async function GET() {
  return NextResponse.json({
    message: "Stripe payment endpoint - POST method required",
  })
}
