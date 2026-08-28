import express from "express";
import { createContact } from "../controllers/contactController.js";
const router = new express.Router();
router.post("/", createContact);
export default router;