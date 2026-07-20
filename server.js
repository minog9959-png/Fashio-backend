import dns from "node:dns";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import formRoutes from "./routes/formRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

const app = express();
app.use(cors());
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://fashio-eight.vercel.app",
// ];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
app.use(express.json());
app.use("/api/form", formRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

// connectDB();
connectDB().catch((err) => console.error("DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/test-db", async (req, res) => {
  try {
    await connectDB();
    res.json({
      success: true,
      message: "MongoDB Connected",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default app;
