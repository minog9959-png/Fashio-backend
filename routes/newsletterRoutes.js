import express from "express";
import { getSubscribers, subscribeNewsletter } from "../controllers/newsletterController.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();
router.post("/", adminAuthMiddleware , subscribeNewsletter);
router.get("/", adminAuthMiddleware ,getSubscribers);

export default router;