import Stripe from 'stripe'

// Create Stripe instance with fallback for build time
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_for_build_only"

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
})

export const createPaymentIntent = async (amount: number, currency = "usd", metadata: Record<string, string> = {}) => {
  try {
    // Check if we have a real Stripe key
    if (stripeSecretKey.includes("placeholder")) {
      throw new Error("Stripe not configured - using placeholder key")
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}

export const confirmPayment = async (paymentIntentId: string) => {
  try {
    // Check if we have a real Stripe key
    if (stripeSecretKey.includes("placeholder")) {
      throw new Error("Stripe not configured - using placeholder key")
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error("Error confirming payment:", error)
    throw error
  }
}
