import express from "express";

import {
  getDashboardStats,
  getRecentOrders,
} from "../controllers/adminDashboardController.js";

import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/stats", adminAuthMiddleware, getDashboardStats);

router.get(
  "/recent-orders",
  adminAuthMiddleware,
  getRecentOrders
);

export default router;