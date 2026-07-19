import express from "express";
import { createProduct, deleteProduct, filterProducts, getProducts, getSingleProduct, paginationProducts, searchProducts, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/filter", filterProducts);
router.get("/pagination", paginationProducts);
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;