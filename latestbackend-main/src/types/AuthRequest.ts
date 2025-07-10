// File: types/AuthRequest.ts

import { Request } from 'express'

export interface AuthenticatedUser {
  id: string
  email: string
  full_name: string
  user_type: 'creator' | 'brand' | 'admin'
  avatar_url: string | null
  verified: boolean
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser
}
