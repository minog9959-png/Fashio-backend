import express from "express";
import { loginAdmin } from "../controllers/adminAuthController.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/test", adminAuthMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin authentication successful",
    admin: req.admin,
  });
});

export default router;