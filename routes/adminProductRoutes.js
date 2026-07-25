import express from "express";
import { deleteProduct, getAllProducts } from "../controllers/adminProductController.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", adminAuthMiddleware, getAllProducts);
router.delete("/:id", adminAuthMiddleware, deleteProduct);

export default router;