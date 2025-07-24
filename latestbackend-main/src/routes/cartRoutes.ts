// File: latestbackend-main/src/routes/cartRoutes.ts

import { Router, Request, Response } from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import { AuthRequest } from '../types/AuthRequest'
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemCount
} from '../services/cartService'
import { wrapAsync } from '../utils/wrapAsync'

const router = Router()

// GET /api/cart - Get user's cart
router.get('/', authenticateToken, wrapAsync(async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const cart = await getUserCart(user.id)
    res.json(cart)
  } catch (error: any) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
}))

// POST /api/cart/add - Add item to cart
router.post('/add', authenticateToken, wrapAsync(async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { productType, productId, quantity = 1 } = req.body

  // Validation
  if (!productType || !productId) {
    return res.status(400).json({ 
      error: 'Missing required fields: productType and productId' 
    })
  }

  if (!['campaign', 'package'].includes(productType)) {
    return res.status(400).json({ 
      error: 'Invalid productType. Must be "campaign" or "package"' 
    })
  }

  if (quantity < 1) {
    return res.status(400).json({ 
      error: 'Quantity must be at least 1' 
    })
  }

  try {
    const cart = await addToCart(user.id, productType, productId, quantity)
    res.json({
      message: 'Item added to cart successfully',
      cart
    })
  } catch (error: any) {
    console.error('Error adding to cart:', error)
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message })
    }
    res.status(500).json({ error: 'Failed to add item to cart' })
  }
}))

// PUT /api/cart/items/:itemId - Update cart item quantity
router.put('/items/:itemId', authenticateToken, wrapAsync(async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { itemId } = req.params
  const { quantity } = req.body

  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ 
      error: 'Invalid quantity. Must be a non-negative number' 
    })
  }

  try {
    const cart = await updateCartItem(user.id, itemId, quantity)
    res.json({
      message: quantity === 0 ? 'Item removed from cart' : 'Cart item updated successfully',
      cart
    })
  } catch (error: any) {
    console.error('Error updating cart item:', error)
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message })
    }
    res.status(500).json({ error: 'Failed to update cart item' })
  }
}))

// DELETE /api/cart/items/:itemId - Remove item from cart
router.delete('/items/:itemId', authenticateToken, wrapAsync(async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { itemId } = req.params

  try {
    const cart = await removeFromCart(user.id, itemId)
    res.json({
      message: 'Item removed from cart successfully',
      cart
    })
  } catch (error: any) {
    console.error('Error removing cart item:', error)
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message })
    }
    res.status(500).json({ error: 'Failed to remove cart item' })
  }
}))

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', authenticateToken, wrapAsync(async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    await clearCart(user.id)
    res.json({
      message: 'Cart cleared successfully'
    })
  } catch (error: any) {
    console.error('Error clearing cart:', error)
    res.status(500).json({ error: 'Failed to clear cart' })
  }
}))

// GET /api/cart/count - Get cart item count
router.get('/count', authenticateToken, wrapAsync(async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const count = await getCartItemCount(user.id)
    res.json({ count })
  } catch (error: any) {
    console.error('Error fetching cart count:', error)
    res.status(500).json({ error: 'Failed to fetch cart count' })
  }
}))

export default router