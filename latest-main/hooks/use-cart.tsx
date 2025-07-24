// File: latest-main/hooks/use-cart.tsx

"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './use-auth'
import { apiClient, Cart, CartItem } from '../lib/api-client'  // Use your existing API client

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  addToCart: (productType: 'campaign' | 'package', productId: string, quantity?: number) => Promise<void>
  updateCartItem: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()

  // Fetch cart data
  const refreshCart = async () => {
    if (!isAuthenticated || !user) {
      setCart(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const cartData = await apiClient.getCart()
      setCart(cartData)
    } catch (err: any) {
      console.error('Error fetching cart:', err)
      setError(err.response?.data?.message || err.message || 'Failed to fetch cart')
    } finally {
      setIsLoading(false)
    }
  }

  // Add item to cart
  const addToCart = async (
    productType: 'campaign' | 'package',
    productId: string,
    quantity: number = 1
  ) => {
    if (!isAuthenticated) {
      setError('Please log in to add items to cart')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.addToCart(productType, productId, quantity)
      setCart(response.cart)
    } catch (err: any) {
      console.error('Error adding to cart:', err)
      setError(err.response?.data?.message || err.message || 'Failed to add item to cart')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Update cart item quantity
  const updateCartItem = async (itemId: string, quantity: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.updateCartItem(itemId, quantity)
      setCart(response.cart)
    } catch (err: any) {
      console.error('Error updating cart item:', err)
      setError(err.response?.data?.message || err.message || 'Failed to update cart item')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.removeFromCart(itemId)
      setCart(response.cart)
    } catch (err: any) {
      console.error('Error removing from cart:', err)
      setError(err.response?.data?.message || err.message || 'Failed to remove item from cart')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await apiClient.clearCart()
      setCart(prev => prev ? { ...prev, items: [], totalItems: 0, totalPrice: 0 } : null)
    } catch (err: any) {
      console.error('Error clearing cart:', err)
      setError(err.response?.data?.message || err.message || 'Failed to clear cart')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Cart drawer controls
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const toggleCart = () => setIsCartOpen(prev => !prev)

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated, user])

  const value: CartContextType = {
    cart,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Re-export types for convenience
export type { Cart, CartItem }