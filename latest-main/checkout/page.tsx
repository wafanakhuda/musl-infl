// File: latest-main/app/checkout/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { FloatingElements } from "../../components/ui/floating-elements"
import { StripePaymentForm } from "../../components/payments/stripe-payment-form"
import { useAuth } from "../../hooks/use-auth"
import { useCart } from "../../hooks/use-cart"
import { toast } from "sonner"
import { 
  ArrowLeft,
  CreditCard,
  Shield,
  CheckCircle,
  Package,
  Users,
  Instagram,
  Youtube,
  Globe
} from "lucide-react"

// Utility function to format currency
const formatCurrency = (cents: number, currency: string = 'USD'): string => {
  const dollars = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(dollars)
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { cart, isLoading, clearCart } = useCart()
  const [showPayment, setShowPayment] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login/brand')
      return
    }
    
    // Check if cart is empty
    if (!isLoading && (!cart || cart.items.length === 0)) {
      toast.error('Your cart is empty')
      router.push('/cart')
      return
    }
  }, [isAuthenticated, router, cart, isLoading])

  const handlePaymentSuccess = async () => {
    setProcessing(true)
    
    try {
      // Create orders in backend for each cart item
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      
      if (cart) {
        for (const item of cart.items) {
          // Create campaign application or order
          await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
              creatorId: item.productId,
              packageId: item.id,
              amount: item.price,
              status: 'paid',
              deliverables: item.product?.description
            })
          })
        }
      }

      // Clear cart using context
      await clearCart()
      
      toast.success('Payment successful! Orders created.')
      router.push('/dashboard/brand?tab=orders')
    } catch (error) {
      console.error('Order creation error:', error)
      toast.success('Payment successful! You will receive order confirmation soon.')
      await clearCart()
      router.push('/dashboard/brand')
    } finally {
      setProcessing(false)
    }
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    toast.info('Payment cancelled')
  }

  const getPlatformIcon = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-400" />
      case 'tiktok':
        return <span className="text-sm font-bold text-white bg-black rounded px-1">T</span>
      default:
        return <Globe className="w-4 h-4 text-gray-400" />
    }
  }

  const subtotal = cart?.totalPrice || 0
  const platformFee = Math.round(subtotal * 0.1 / 100) // Convert from cents and calculate fee
  const total = subtotal + (platformFee * 100) // Keep in cents

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden flex items-center justify-center">
        <FloatingElements />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (showPayment && cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingElements />
        
        <div className="relative z-10 pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Complete Payment</h1>
              <p className="text-slate-400">Total: {formatCurrency(total)}</p>
            </div>

            <StripePaymentForm
              amount={total / 100} // Convert to dollars for Stripe
              campaignTitle={`${cart.items.length} creator package(s)`}
              creatorName={cart.items.map(item => 
                item.product?.creator?.full_name || item.product?.brand?.full_name || 'Creator'
              ).join(', ')}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={() => router.push('/cart')} variant="outline" className="border-slate-600 text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-green-400" />
                Checkout
              </h1>
              <p className="text-slate-400">Review your order and complete payment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Review */}
            <div className="lg:col-span-2 space-y-6">
              {/* Security Notice */}
              <Card className="p-6 bg-green-500/10 border-green-500/30 backdrop-blur-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-green-400" />
                  <h3 className="font-semibold text-green-400">Secure Escrow Payment</h3>
                </div>
                <div className="text-sm text-green-300 space-y-1">
                  <p>• Your payment is held securely until work is completed</p>
                  <p>• Creators are paid only after you approve the deliverables</p>
                  <p>• Full refund guarantee if work doesn't meet requirements</p>
                </div>
              </Card>

              {/* Order Items */}
              <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
                
                <div className="space-y-4">
                  {cart.items.map((item, index) => (
                    <div key={item.id} className={`flex items-start gap-4 ${index > 0 ? 'pt-4 border-t border-slate-600' : ''}`}>
                      {/* Creator Info */}
                      <img
                        src={item.product?.creator?.avatar_url || item.product?.brand?.avatar_url || "/placeholder-user.jpg"}
                        alt={item.product?.creator?.full_name || item.product?.brand?.full_name || "Creator"}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getPlatformIcon(item.productType)}
                              <h4 className="font-semibold text-white">{item.product?.title}</h4>
                            </div>
                            <p className="text-sm text-slate-400 mb-1">
                              by {item.product?.creator?.full_name || item.product?.brand?.full_name}
                            </p>
                            <p className="text-sm text-slate-300">{item.product?.description}</p>
                          </div>
                          <span className="text-lg font-bold text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                        
                        {item.quantity > 1 && (
                          <div className="text-sm text-slate-400">
                            Quantity: {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* What Happens Next */}
              <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                <h3 className="text-lg font-semibold text-white mb-4">What Happens Next?</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="text-white font-medium">Payment Processed</p>
                      <p className="text-slate-400 text-sm">Your payment is securely held in escrow</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="text-white font-medium">Creators Notified</p>
                      <p className="text-slate-400 text-sm">Creators receive your order and begin work</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="text-white font-medium">Content Delivered</p>
                      <p className="text-slate-400 text-sm">Review and approve deliverables in your dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <p className="text-white font-medium">Payment Released</p>
                      <p className="text-slate-400 text-sm">Creators are paid after your approval</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-lg sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal ({cart.totalItems} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Platform fee (10%)</span>
                    <span>{formatCurrency(platformFee * 100)}</span>
                  </div>
                  <div className="border-t border-slate-600 pt-3">
                    <div className="flex justify-between text-white font-semibold text-xl">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowPayment(true)} 
                  className="w-full bg-green-600 hover:bg-green-500 text-white"
                  disabled={processing}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {processing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
                </Button>

                <div className="mt-4 text-xs text-slate-400 space-y-1">
                  <p className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    SSL encrypted payment
                  </p>
                  <p className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    Money-back guarantee
                  </p>
                  <p className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    Secure escrow protection
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}