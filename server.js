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
    origin: "https://fashio-x565.vercel.app/",
    // origin:https://fashio-x565.vercel.app/
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/form", formRoutes);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
