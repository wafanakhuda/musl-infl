// File: latest-main/components/cart/cart-drawer.tsx

"use client"

import { useCart } from '../../hooks/use-cart'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Package,
  Megaphone
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Utility function to format currency
const formatCurrency = (cents: number, currency: string = 'USD'): string => {
  const dollars = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(dollars)
}

interface CartDrawerProps {
  children?: React.ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const {
    cart,
    isLoading,
    error,
    updateCartItem,
    removeFromCart,
    clearCart,
    isCartOpen,
    closeCart,
    toggleCart
  } = useCart()

  const router = useRouter()

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart()
      } catch (error) {
        console.error('Failed to clear cart:', error)
      }
    }
  }

  const CartTrigger = children || (
    <Button
      variant="ghost"
      size="sm"
      className="relative p-2"
      onClick={toggleCart}
      aria-label="View Cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {cart && cart.totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
        >
          {cart.totalItems}
        </Badge>
      )}
    </Button>
  )

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetTrigger asChild>
        {CartTrigger}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {cart && cart.totalItems > 0 && (
              <Badge variant="secondary">
                {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Review and manage your cart items
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {cart && cart.items.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button onClick={closeCart} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            )}

            {cart && cart.items.length > 0 && (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Product Icon */}
                      <div className="flex-shrink-0">
                        {item.productType === 'campaign' ? (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Megaphone className="h-5 w-5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.product?.title || 'Unknown Product'}
                        </h4>
                        
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.product?.description}
                        </p>

                        {/* Creator/Brand Info */}
                        {(item.product?.creator || item.product?.brand) && (
                          <div className="flex items-center gap-2 mt-2">
                            <Avatar className="h-4 w-4">
                              <AvatarImage 
                                src={item.product?.creator?.avatar_url || item.product?.brand?.avatar_url} 
                              />
                              <AvatarFallback className="text-xs">
                                {(item.product?.creator?.full_name || item.product?.brand?.full_name)?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">
                              {item.product?.creator?.full_name || item.product?.brand?.full_name}
                            </span>
                          </div>
                        )}

                        {/* Price and Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isLoading || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="text-sm font-medium px-2">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isLoading}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Clear Cart Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t pt-4 mt-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}