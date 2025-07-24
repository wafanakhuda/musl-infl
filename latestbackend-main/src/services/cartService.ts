// File: latestbackend-main/src/services/cartService.ts

import prisma from '../lib/prisma'

export interface CartItem {
  id: string
  productType: 'campaign' | 'package'
  productId: string
  quantity: number
  price: number
  product?: any // Will be populated with campaign or package data
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  totalItems: number
  totalPrice: number
  created_at: Date
  updated_at: Date
}

// Get or create user's cart
export const getUserCart = async (userId: string): Promise<Cart> => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: true
    }
  })

  // Create cart if it doesn't exist
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: true
      }
    })
  }

  // Populate product data for each item
  const itemsWithProducts = await Promise.all(
    cart.items.map(async (item: any) => {
      let product = null
      
      if (item.productType === 'campaign') {
        product = await prisma.campaign.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            title: true,
            description: true,
            budget_min: true,
            budget_max: true,
            brand: {
              select: { 
                id: true,
                full_name: true, 
                avatar_url: true 
              }
            }
          }
        })
      } else if (item.productType === 'package') {
        product = await prisma.package.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            creator: {
              select: { 
                id: true,
                full_name: true, 
                avatar_url: true 
              }
            }
          }
        })
      }

      return {
        id: item.id,
        productType: item.productType as 'campaign' | 'package',
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        product
      }
    })
  )

  const totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
  const totalPrice = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

  return {
    id: cart.id,
    userId: cart.userId,
    items: itemsWithProducts,
    totalItems,
    totalPrice,
    created_at: cart.created_at,
    updated_at: cart.updated_at
  }
}

// Add item to cart
export const addToCart = async (
  userId: string,
  productType: 'campaign' | 'package',
  productId: string,
  quantity: number = 1
): Promise<Cart> => {
  // Get product price
  let price = 0
  if (productType === 'campaign') {
    const campaign = await prisma.campaign.findUnique({
      where: { id: productId },
      select: { budget_min: true, budget_max: true }
    })
    if (!campaign) throw new Error('Campaign not found')
    // Use budget_min as the price, convert to cents
    price = (campaign.budget_min || 0) * 100
  } else if (productType === 'package') {
    const pkg = await prisma.package.findUnique({
      where: { id: productId },
      select: { price: true }
    })
    if (!pkg) throw new Error('Package not found')
    price = pkg.price * 100 // Convert to cents if not already
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({ where: { userId } })
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } })
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productType_productId: {
        cartId: cart.id,
        productType,
        productId
      }
    }
  })

  if (existingItem) {
    // Update quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { 
        quantity: existingItem.quantity + quantity,
        updated_at: new Date()
      }
    })
  } else {
    // Create new cart item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productType,
        productId,
        quantity,
        price
      }
    })
  }

  // Update cart timestamp
  await prisma.cart.update({
    where: { id: cart.id },
    data: { updated_at: new Date() }
  })

  return getUserCart(userId)
}

// Update cart item quantity
export const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
): Promise<Cart> => {
  // Verify item belongs to user's cart
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId }
    }
  })

  if (!item) throw new Error('Cart item not found')

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    await prisma.cartItem.delete({ where: { id: itemId } })
  } else {
    // Update quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { 
        quantity,
        updated_at: new Date()
      }
    })
  }

  // Update cart timestamp
  await prisma.cart.update({
    where: { id: item.cartId },
    data: { updated_at: new Date() }
  })

  return getUserCart(userId)
}

// Remove item from cart
export const removeFromCart = async (
  userId: string,
  itemId: string
): Promise<Cart> => {
  // Verify item belongs to user's cart
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId }
    }
  })

  if (!item) throw new Error('Cart item not found')

  await prisma.cartItem.delete({ where: { id: itemId } })

  // Update cart timestamp
  await prisma.cart.update({
    where: { id: item.cartId },
    data: { updated_at: new Date() }
  })

  return getUserCart(userId)
}

// Clear entire cart
export const clearCart = async (userId: string): Promise<void> => {
  const cart = await prisma.cart.findUnique({ where: { userId } })
  if (!cart) return

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  })

  await prisma.cart.update({
    where: { id: cart.id },
    data: { updated_at: new Date() }
  })
}

// Get cart item count
export const getCartItemCount = async (userId: string): Promise<number> => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        select: { quantity: true }
      }
    }
  })

  if (!cart) return 0

  return cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
}