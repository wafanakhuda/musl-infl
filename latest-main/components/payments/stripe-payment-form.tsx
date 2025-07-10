"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { CreditCard, Shield, CheckCircle } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_demo")

interface PaymentFormProps {
  amount: number
  campaignTitle: string
  creatorName: string
  onSuccess: () => void
  onCancel: () => void
}

function PaymentForm({ amount, campaignTitle, creatorName, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // In demo mode, simulate successful payment
      if (
        !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "pk_test_demo"
      ) {
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setSucceeded(true)
        setTimeout(() => {
          onSuccess()
        }, 1500)
        return
      }

      // Real Stripe payment processing
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: "usd",
          metadata: {
            campaign_title: campaignTitle,
            creator_name: creatorName,
          },
        }),
      })

      const { client_secret } = await response.json()

      const { error: stripeError } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (stripeError) {
        setError(stripeError.message || "Payment failed")
      } else {
        setSucceeded(true)
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      setError("Payment processing failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (succeeded) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Payment Successful!</h3>
              <p className="text-muted-foreground">Your payment has been processed successfully.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Amount:</strong> ${amount.toFixed(2)}
              </p>
              <p className="text-sm">
                <strong>Campaign:</strong> {campaignTitle}
              </p>
              <p className="text-sm">
                <strong>Creator:</strong> {creatorName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Complete Payment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Campaign:</span>
            <span className="text-sm font-medium">{campaignTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Creator:</span>
            <span className="text-sm font-medium">{creatorName}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium">Total Amount:</span>
            <span className="font-bold text-lg">${amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Card Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-lg bg-background">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          {/* Demo Mode Notice */}
          {(!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "pk_test_demo") && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> Use any test card number (e.g., 4242 4242 4242 4242)
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!stripe || loading} className="flex-1">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

interface StripePaymentFormProps extends PaymentFormProps {}

export function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  )
}
