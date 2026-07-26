import express from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/adminOrderController.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", adminAuthMiddleware, getAllOrders);
router.put("/:id/status", adminAuthMiddleware, updateOrderStatus);

export default router;