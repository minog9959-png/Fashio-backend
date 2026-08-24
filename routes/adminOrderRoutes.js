import express from "express";
import { getAllOrders, getOrderById, updateOrderStatus } from "../controllers/adminOrderController.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", adminAuthMiddleware, getAllOrders);
router.put("/:id/status", adminAuthMiddleware, updateOrderStatus);
router.get("/:id", adminAuthMiddleware, getOrderById);

export default router;