import dns from "node:dns";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import formRoutes from "./routes/formRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://fashio-eight.vercel.app/",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/form", formRoutes);
// Health check

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

// connectDB();
connectDB().catch((err) => console.error("DB Error:", err));
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

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
