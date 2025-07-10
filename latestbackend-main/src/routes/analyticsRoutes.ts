// src/routes/analyticsRoutes.ts
import { Router, Request, Response } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { getPlatformStats } from "../services/analyticsService";
import { wrapAsync } from "../utils/wrapAsync";
import { isAuthenticated } from "../middlewares/authMiddleware"; // ✅ correct import

const router = Router();

router.get(
  "/",
  authenticateToken,
  wrapAsync(async (req: Request, res: Response) => {
if (!isAuthenticated(req)) {
  return res.status(403).json({ error: "Admin access only" });
}

const user = (req as any).user; // or use: const user = (req as AuthRequest).user;

if (user.user_type !== "admin") {
  return res.status(403).json({ error: "Admin access only" });
}

    const stats = await getPlatformStats();
    res.json(stats);
  })
);

export default router;
