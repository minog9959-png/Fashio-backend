import express from "express";

import {
  deleteUser,
  getAllUsers,
} from "../controllers/adminUserController.js";

import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", adminAuthMiddleware, getAllUsers);
router.delete("/:id", adminAuthMiddleware, deleteUser);

export default router;