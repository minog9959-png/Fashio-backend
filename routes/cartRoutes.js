import express from "express";
import { addToCart, deleteCart, getCart, updateCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/:userId",getCart);
router.put("/:id",updateCart);
router.delete("/:id",deleteCart);

export default router;