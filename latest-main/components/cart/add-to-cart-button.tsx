// File: latest-main/components/cart/add-to-cart-button.tsx

"use client"

import { useState } from 'react'
import { Button } from '../ui/button'
import { useCart } from '../../hooks/use-cart'
import { useAuth } from '../../hooks/use-auth'
import { ShoppingCart, Plus, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  productType: 'campaign' | 'package'
  productId: string
  productTitle?: string
  quantity?: number
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  disabled?: boolean
  showIcon?: boolean
  children?: React.ReactNode
}

export function AddToCartButton({
  productType,
  productId,
  productTitle,
  quantity = 1,
  variant = 'default',
  size = 'default',
  className,
  disabled = false,
  showIcon = true,
  children
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addToCart, cart } = useCart()
  const { isAuthenticated } = useAuth()

  // Check if item is already in cart
  const isInCart = cart?.items.some(
    item => item.productType === productType && item.productId === productId
  )

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart')
      return
    }

    if (isInCart) {
      toast.info('This item is already in your cart')
      return
    }

    setIsAdding(true)

    try {
      await addToCart(productType, productId, quantity)
      
      setJustAdded(true)
      toast.success(
        productTitle 
          ? `"${productTitle}" added to cart!` 
          : 'Item added to cart!'
      )

      // Reset the "just added" state after 2 seconds
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)

    } catch (error: any) {
      console.error('Failed to add to cart:', error)
      toast.error(
        error.message || 'Failed to add item to cart'
      )
    } finally {
      setIsAdding(false)
    }
  }

  // Different button states
  const getButtonContent = () => {
    if (isAdding) {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Adding...
        </>
      )
    }

    if (justAdded) {
      return (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added!
        </>
      )
    }

    if (isInCart) {
      return (
        <>
          <Check className="h-4 w-4 mr-2" />
          In Cart
        </>
      )
    }

    if (children) {
      return children
    }

    return (
      <>
        {showIcon && <ShoppingCart className="h-4 w-4 mr-2" />}
        Add to Cart
      </>
    )
  }

  const getButtonVariant = () => {
    if (isInCart) return 'outline'
    if (justAdded) return 'secondary'
    return variant
  }

  return (
    <Button
      variant={getButtonVariant()}
      size={size}
      className={className}
      onClick={handleAddToCart}
      disabled={disabled || isAdding || !isAuthenticated}
    >
      {getButtonContent()}
    </Button>
  )
}

// Utility component for quick add with minimal props
export function QuickAddToCartButton({
  productType,
  productId,
  className = "h-8 w-8 p-0"
}: {
  productType: 'campaign' | 'package'
  productId: string
  className?: string
}) {
  return (
    <AddToCartButton
      productType={productType}
      productId={productId}
      variant="outline"
      size="sm"
      className={className}
      showIcon={true}
    >
      <Plus className="h-4 w-4" />
    </AddToCartButton>
  )
}