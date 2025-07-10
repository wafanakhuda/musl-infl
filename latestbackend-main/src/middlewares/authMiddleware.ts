import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { AuthRequest, AuthenticatedUser } from '../types/AuthRequest'

/**
 * Middleware to authenticate JWT and attach user info to request
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
      id: string
      user_type: 'creator' | 'brand' | 'admin'
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    // Safe assignment of user object to req
    (req as AuthRequest).user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      user_type: user.user_type,
      avatar_url: user.avatar_url ?? null,
      verified: user.verified,
    }

    next()
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' })
  }
}

/**
 * Type guard: Checks if user is authenticated
 */
export const isAuthenticated = (req: Request): req is AuthRequest => {
  const user = (req as AuthRequest).user
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof user.id === 'string' &&
    typeof user.user_type === 'string'
  )
}

/**
 * Type guard: Checks if user is an admin
 */
export const isAdmin = (req: AuthRequest): boolean => {
  return req.user?.user_type === 'admin'
}
