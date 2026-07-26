import express from "express";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/adminProductController.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", adminAuthMiddleware, getAllProducts);

router.post("/", adminAuthMiddleware, createProduct);

router.delete("/:id", adminAuthMiddleware, deleteProduct);

router.put("/:id", adminAuthMiddleware, updateProduct);

export default router;