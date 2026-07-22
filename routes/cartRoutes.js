import express from "express";
import { addToCart, deleteCart, getCart, updateCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware ,addToCart);
router.get("/:userId", authMiddleware ,getCart);
router.put("/:id",updateCart);
router.delete("/:id",deleteCart);

export default router;