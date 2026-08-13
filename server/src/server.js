import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
import capsuleRoutes from "./routes/capsuleRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/capsules", capsuleRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Rewynd API is running 🚀",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Rewynd API running on port ${PORT}`);
});