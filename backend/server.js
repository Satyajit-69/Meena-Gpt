import cors from "cors";
dotenv.config();

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

// config

const app = express();

// middlewares
app.use(
  cors({
    origin: [
      "https://meena-gpt.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

// database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected 🍃✅");
  } catch (err) {
    console.error("Mongo Error:", err);
    process.exit(1);
  }
};

// start server
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running 🏃💨 on port ${process.env.PORT || 8000}`);
  connectDB();
});
