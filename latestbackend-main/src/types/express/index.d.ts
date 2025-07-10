// src/types/express/index.d.ts
import { UserRole } from "@prisma/client"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        user_type: UserRole
      }
    }
  }
}
