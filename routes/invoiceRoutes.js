import express from "express";
import { generateInvoice } from "../controllers/invoiceController.js";

const router  = express.Router();
router.get("/:orderId",generateInvoice);
export default router;