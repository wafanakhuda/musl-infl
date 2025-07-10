
export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "../../../../lib/stripe"
import { db } from "../../../../lib/database-api"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        await db.updatePaymentStatus(paymentIntent.id, "succeeded")
        console.log("Payment succeeded:", paymentIntent.id)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        await db.updatePaymentStatus(failedPayment.id, "failed")
        console.log("Payment failed:", failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}
