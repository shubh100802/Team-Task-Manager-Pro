import { Router } from "express";
import { getDashboardStatsController } from "../controllers/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/stats", authMiddleware, getDashboardStatsController);

export default router;
