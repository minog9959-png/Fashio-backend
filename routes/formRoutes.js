import express from "express";
import { createForm, loginForm } from "../controllers/formController.js";

const router = express.Router();

// Signup
router.post("/signup", createForm);

// Login
router.post("/login", loginForm);

export default router;