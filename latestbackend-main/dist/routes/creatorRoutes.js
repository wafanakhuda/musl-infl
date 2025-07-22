"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const creatorService_1 = require("../services/creatorService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const creators = await (0, creatorService_1.getFilteredCreators)(req.query);
        res.json(creators);
    }
    catch (err) {
        console.error("Error fetching creators:", err);
        res.status(500).json({ error: "Failed to fetch creators" });
    }
});
router.post("/packages", authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const { packages } = req.body;
        const userId = authReq.user?.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        if (authReq.user?.user_type !== "creator") {
            res.status(403).json({ error: "Only creators can create packages" });
            return;
        }
        if (!packages || !Array.isArray(packages) || packages.length === 0) {
            res.status(400).json({ error: "Invalid packages data" });
            return;
        }
        for (const pkg of packages) {
            if (!pkg.title || !pkg.description || !pkg.price) {
                res.status(400).json({ error: "Each package must have title, description, and price" });
                return;
            }
            if (typeof pkg.price !== "number" || pkg.price <= 0) {
                res.status(400).json({ error: "Price must be a positive number" });
                return;
            }
        }
        await prisma_1.default.package.deleteMany({
            where: { creatorId: userId }
        });
        const createdPackages = await prisma_1.default.package.createMany({
            data: packages.map((pkg) => ({
                creatorId: userId,
                title: pkg.title,
                description: pkg.description,
                price: Math.round(pkg.price),
            }))
        });
        res.status(201).json({
            message: "Packages created successfully",
            count: createdPackages.count
        });
    }
    catch (error) {
        console.error("Error creating packages:", error);
        res.status(500).json({ error: "Failed to create packages" });
    }
});
router.get("/:creatorId/packages", async (req, res) => {
    try {
        const { creatorId } = req.params;
        const creator = await prisma_1.default.user.findUnique({
            where: { id: creatorId },
            select: { id: true, user_type: true }
        });
        if (!creator || creator.user_type !== "creator") {
            res.status(404).json({ error: "Creator not found" });
            return;
        }
        const packages = await prisma_1.default.package.findMany({
            where: { creatorId },
            orderBy: { price: 'asc' },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                created_at: true,
            }
        });
        res.status(200).json({ packages });
    }
    catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({ error: "Failed to fetch packages" });
    }
});
router.put("/packages/:packageId", authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const { packageId } = req.params;
        const { title, description, price } = req.body;
        const userId = authReq.user?.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const existingPackage = await prisma_1.default.package.findUnique({
            where: { id: packageId },
            include: { creator: { select: { id: true } } }
        });
        if (!existingPackage) {
            res.status(404).json({ error: "Package not found" });
            return;
        }
        if (existingPackage.creator.id !== userId) {
            res.status(403).json({ error: "Unauthorized to update this package" });
            return;
        }
        const updatedPackage = await prisma_1.default.package.update({
            where: { id: packageId },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(price && { price: Math.round(price) }),
            }
        });
        res.status(200).json({
            message: "Package updated successfully",
            package: updatedPackage
        });
    }
    catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ error: "Failed to update package" });
    }
});
router.delete("/packages/:packageId", authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const { packageId } = req.params;
        const userId = authReq.user?.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const existingPackage = await prisma_1.default.package.findUnique({
            where: { id: packageId },
            include: { creator: { select: { id: true } } }
        });
        if (!existingPackage) {
            res.status(404).json({ error: "Package not found" });
            return;
        }
        if (existingPackage.creator.id !== userId) {
            res.status(403).json({ error: "Unauthorized to delete this package" });
            return;
        }
        await prisma_1.default.package.delete({
            where: { id: packageId }
        });
        res.status(200).json({ message: "Package deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ error: "Failed to delete package" });
    }
});
exports.default = router;
