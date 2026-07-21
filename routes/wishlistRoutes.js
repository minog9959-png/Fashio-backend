import express from "express";
import { addToWishlist, deleteWishlistItem, getWishlist } from "../controllers/wishlistController.js";

const router = express.Router();
router.post("/",addToWishlist);
router.get("/:userId",getWishlist);
router.delete("/:id",deleteWishlistItem);

export default router;