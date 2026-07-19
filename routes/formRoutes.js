import express from "express";
import {
  createForm,
  loginForm,
  verifyEmail,
  verifyUser,
} from "../controllers/formController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", createForm);

router.post("/login", loginForm);

router.get("/verify/:token", verifyEmail);

// JWT Verify
router.get("/me", authMiddleware, verifyUser);

export default router;