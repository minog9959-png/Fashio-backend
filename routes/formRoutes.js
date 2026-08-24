import express from "express";
import {
  createForm,
  loginForm,
  firebaseSignup,
  firebaseLogin,
  verifyEmail,
  verifyUser,
  saveFcmToken
} from "../controllers/formController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", createForm);

router.post("/login", loginForm);


router.post("/firebase-signup", firebaseSignup);
router.post("/firebase-login", firebaseLogin);

router.get("/verify/:token", verifyEmail);

// Save Firebase FCM Token
router.post("/save-fcm-token", authMiddleware, saveFcmToken);

// JWT Verify
router.get("/me", authMiddleware, verifyUser);

export default router;