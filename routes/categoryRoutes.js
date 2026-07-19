import express from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";
const router = express.Router();

//Create Category:
router.post("/",createCategory)
router.get("/",getCategories)
router.put("/:id",updateCategory)
router.delete("/:id",deleteCategory)
export default router;
