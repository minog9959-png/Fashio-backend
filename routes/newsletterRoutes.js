import express from "express";
import { getSubscribers, subscribeNewsletter } from "../controllers/newsletterController.js";
const router = express.Router();
router.post("/",subscribeNewsletter);
router.get("/", getSubscribers);

export default router;