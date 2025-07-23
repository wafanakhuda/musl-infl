import express, { Request, Response } from "express"
import { getFilteredCreators } from "../services/creatorService"
import { authenticateToken } from "../middlewares/authMiddleware"
import prisma from "../lib/prisma"
import { AuthRequest } from "../types/AuthRequest"

const router = express.Router()

// ✅ Get filtered creators - /creators
router.get("/", async (req: Request, res: Response) => {
  try {
    const creators = await getFilteredCreators(req.query as any)
    res.json(creators)
  } catch (err) {
    console.error("Error fetching creators:", err)
    res.status(500).json({ error: "Failed to fetch creators" })
  }
})

// ✅ Get specific creator by ID - /creators/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const creator = await prisma.user.findUnique({
      where: { 
        id,
        user_type: "creator" // Ensure we only return creators
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        user_type: true,
        avatar_url: true,
        bio: true,
        location: true,
        niche: true,
        followers: true,
        price_min: true,
        price_max: true,
        platforms: true,
        website: true,
        email_verified: true,
        verified: true,
        created_at: true,
      }
    })

    if (!creator) {
      res.status(404).json({ error: "Creator not found" })
      return
    }

    res.json(creator)
  } catch (err) {
    console.error("Error fetching creator:", err)
    res.status(500).json({ error: "Failed to fetch creator" })
  }
})

// ✅ Create packages for a creator - /creators/packages
router.post("/packages", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Cast req to AuthRequest after authentication
    const authReq = req as AuthRequest
    const { packages } = req.body
    const userId = authReq.user?.id

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" })
      return
    }

    // Validate user is a creator
    if (authReq.user?.user_type !== "creator") {
      res.status(403).json({ error: "Only creators can create packages" })
      return
    }

    // Validate packages data
    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      res.status(400).json({ error: "Invalid packages data" })
      return
    }

    // Validate each package
    for (const pkg of packages) {
      if (!pkg.title || !pkg.description || !pkg.price) {
        res.status(400).json({ error: "Each package must have title, description, and price" })
        return
      }
      if (typeof pkg.price !== "number" || pkg.price <= 0) {
        res.status(400).json({ error: "Price must be a positive number" })
        return
      }
    }

    // Delete existing packages for this creator (optional - remove if you want to keep old packages)
    await prisma.package.deleteMany({
      where: { creatorId: userId }
    })

    // Create new packages
    const createdPackages = await prisma.package.createMany({
      data: packages.map((pkg: any) => ({
        creatorId: userId,
        title: pkg.title,
        description: pkg.description,
        price: Math.round(pkg.price), // Ensure integer for cents/lowest currency unit
      }))
    })

    res.status(201).json({ 
      message: "Packages created successfully",
      count: createdPackages.count 
    })
  } catch (error: any) {
    console.error("Error creating packages:", error)
    res.status(500).json({ error: "Failed to create packages" })
  }
})

// ✅ Get packages for a specific creator - /creators/:creatorId/packages
router.get("/:creatorId/packages", async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params

    // Verify creator exists
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
      select: { id: true, user_type: true }
    })

    if (!creator || creator.user_type !== "creator") {
      res.status(404).json({ error: "Creator not found" })
      return
    }

    const packages = await prisma.package.findMany({
      where: { creatorId },
      orderBy: { price: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        created_at: true,
      }
    })

    res.status(200).json({ packages })
  } catch (error: any) {
    console.error("Error fetching packages:", error)
    res.status(500).json({ error: "Failed to fetch packages" })
  }
})

// ✅ Update a specific package - /creators/packages/:packageId
router.put("/packages/:packageId", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Cast req to AuthRequest after authentication
    const authReq = req as AuthRequest
    const { packageId } = req.params
    const { title, description, price } = req.body
    const userId = authReq.user?.id

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" })
      return
    }

    // Verify package belongs to the authenticated creator
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId },
      include: { creator: { select: { id: true } } }
    })

    if (!existingPackage) {
      res.status(404).json({ error: "Package not found" })
      return
    }

    if (existingPackage.creator.id !== userId) {
      res.status(403).json({ error: "Unauthorized to update this package" })
      return
    }

    // Update package
    const updatedPackage = await prisma.package.update({
      where: { id: packageId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: Math.round(price) }),
      }
    })

    res.status(200).json({ 
      message: "Package updated successfully",
      package: updatedPackage 
    })
  } catch (error: any) {
    console.error("Error updating package:", error)
    res.status(500).json({ error: "Failed to update package" })
  }
})

// ✅ Delete a specific package - /creators/packages/:packageId
router.delete("/packages/:packageId", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Cast req to AuthRequest after authentication
    const authReq = req as AuthRequest
    const { packageId } = req.params
    const userId = authReq.user?.id

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" })
      return
    }

    // Verify package belongs to the authenticated creator
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId },
      include: { creator: { select: { id: true } } }
    })

    if (!existingPackage) {
      res.status(404).json({ error: "Package not found" })
      return
    }

    if (existingPackage.creator.id !== userId) {
      res.status(403).json({ error: "Unauthorized to delete this package" })
      return
    }

    // Delete package
    await prisma.package.delete({
      where: { id: packageId }
    })

    res.status(200).json({ message: "Package deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting package:", error)
    res.status(500).json({ error: "Failed to delete package" })
  }
})

export default router