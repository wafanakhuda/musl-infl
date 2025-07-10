"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const creatorService_1 = require("../services/creatorService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
// ✅ Get filtered creators - /creators
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creators = yield (0, creatorService_1.getFilteredCreators)(req.query);
        res.json(creators);
    }
    catch (err) {
        console.error("Error fetching creators:", err);
        res.status(500).json({ error: "Failed to fetch creators" });
    }
}));
// ✅ Create packages for a creator - /creators/packages
router.post("/packages", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Cast req to AuthRequest after authentication
        const authReq = req;
        const { packages } = req.body;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        // Validate user is a creator
        if (((_b = authReq.user) === null || _b === void 0 ? void 0 : _b.user_type) !== "creator") {
            res.status(403).json({ error: "Only creators can create packages" });
            return;
        }
        // Validate packages data
        if (!packages || !Array.isArray(packages) || packages.length === 0) {
            res.status(400).json({ error: "Invalid packages data" });
            return;
        }
        // Validate each package
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
        // Delete existing packages for this creator (optional - remove if you want to keep old packages)
        yield prisma_1.default.package.deleteMany({
            where: { creatorId: userId }
        });
        // Create new packages
        const createdPackages = yield prisma_1.default.package.createMany({
            data: packages.map((pkg) => ({
                creatorId: userId,
                title: pkg.title,
                description: pkg.description,
                price: Math.round(pkg.price), // Ensure integer for cents/lowest currency unit
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
}));
// ✅ Get packages for a specific creator - /creators/:creatorId/packages
router.get("/:creatorId/packages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { creatorId } = req.params;
        // Verify creator exists
        const creator = yield prisma_1.default.user.findUnique({
            where: { id: creatorId },
            select: { id: true, user_type: true }
        });
        if (!creator || creator.user_type !== "creator") {
            res.status(404).json({ error: "Creator not found" });
            return;
        }
        const packages = yield prisma_1.default.package.findMany({
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
}));
// ✅ Update a specific package - /creators/packages/:packageId
router.put("/packages/:packageId", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Cast req to AuthRequest after authentication
        const authReq = req;
        const { packageId } = req.params;
        const { title, description, price } = req.body;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        // Verify package belongs to the authenticated creator
        const existingPackage = yield prisma_1.default.package.findUnique({
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
        // Update package
        const updatedPackage = yield prisma_1.default.package.update({
            where: { id: packageId },
            data: Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (price && { price: Math.round(price) }))
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
}));
// ✅ Delete a specific package - /creators/packages/:packageId
router.delete("/packages/:packageId", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Cast req to AuthRequest after authentication
        const authReq = req;
        const { packageId } = req.params;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        // Verify package belongs to the authenticated creator
        const existingPackage = yield prisma_1.default.package.findUnique({
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
        // Delete package
        yield prisma_1.default.package.delete({
            where: { id: packageId }
        });
        res.status(200).json({ message: "Package deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ error: "Failed to delete package" });
    }
}));
exports.default = router;
