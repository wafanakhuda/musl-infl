// File: latest-main/app/cart/page.tsx

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { FloatingElements } from "../../components/ui/floating-elements"
import { useAuth } from "../../hooks/use-auth"
import { useCart } from "../../hooks/use-cart"
import { toast } from "sonner"
import { 
  ArrowLeft,
  ShoppingCart,
  Trash2,
  CreditCard,
  Package,
  Users,
  Instagram,
  Youtube,
  Globe,
  Plus,
  Minus
} from "lucide-react"

// Utility function to format currency
const formatCurrency = (cents: number, currency: string = 'USD'): string => {
  const dollars = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(dollars)
}

export default function CartPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { 
    cart, 
    isLoading, 
    error, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login/brand')
      return
    }
  }, [isAuthenticated, router])

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart()
        toast.success('Cart cleared')
      } catch (error) {
        toast.error('Failed to clear cart')
      }
    }
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    router.push('/checkout')
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
  const finalTotal = subtotal + (platformFee * 100) // Convert back to cents

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden flex items-center justify-center">
        <FloatingElements />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden flex items-center justify-center">
        <FloatingElements />
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button onClick={() => router.back()} variant="outline" className="border-slate-600 text-slate-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="w-8 h-8 text-teal-400" />
                  Shopping Cart
                </h1>
                <p className="text-slate-400">{cart?.totalItems || 0} item(s) in your cart</p>
              </div>
            </div>
            
            {cart && cart.items.length > 0 && (
              <Button onClick={handleClearCart} variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>

          {!cart || cart.items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <ShoppingCart className="w-24 h-24 mx-auto text-slate-600 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-slate-400 mb-8">Browse our creators and add their packages to get started</p>
              <Button onClick={() => router.push('/creators')} className="bg-teal-600 hover:bg-teal-500">
                Browse Creators
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                    <div className="flex items-start gap-4">
                      {/* Creator Avatar */}
                      <img
                        src={item.product?.creator?.avatar_url || item.product?.brand?.avatar_url || "/placeholder-user.jpg"}
                        alt={item.product?.creator?.full_name || item.product?.brand?.full_name || "Creator"}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"
                      />
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getPlatformIcon(item.productType)}
                              <h3 className="font-semibold text-white">{item.product?.title}</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-1">
                              by {item.product?.creator?.full_name || item.product?.brand?.full_name}
                            </p>
                            <p className="text-sm text-slate-300">{item.product?.description}</p>
                          </div>
                          
                          <Button
                            onClick={() => handleRemoveItem(item.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 border-slate-600"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isLoading || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="text-sm font-medium px-2 text-white">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 border-slate-600"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isLoading}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <span className="text-xl font-bold text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-lg sticky top-24">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal ({cart.totalItems} items)</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Platform fee (10%)</span>
                      <span>{formatCurrency(platformFee * 100)}</span>
                    </div>
                    <div className="border-t border-slate-600 pt-3">
                      <div className="flex justify-between text-white font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleCheckout} className="w-full bg-green-600 hover:bg-green-500 text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <div className="mt-4 text-xs text-slate-400 space-y-1">
                    <p>• Secure payment processing</p>
                    <p>• Money held in escrow until delivery</p>
                    <p>• Full refund if unsatisfied</p>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}