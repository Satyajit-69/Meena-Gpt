import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"
import authRoutes from "./routes/auth.js" ;

//configuration
dotenv.config();
const app = express();

//middlewares
app.use(
  cors({
    origin: "*", // or later: your frontend render domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// //post route
// app.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     const result = await model.generateContent(message);
//     const reply = result.response.text();
//     res.send(reply);

//   } catch (err) {
//     console.error("Gemini Error:", err);
//     res.status(500).send("Gemini AI failed");
//   }
// });
app.use("/api/auth" , authRoutes) ;
app.use("/api" ,chatRoutes) ;

//connect with mongo
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL) ;
        console.log("MongoDB connected 🍃✅") ;
    }
    catch(err) {
        console.log("Error" , err) ;
    }
}


app.listen(process.env.PORT, () => {
  console.log(`Server running 🏃💨 at ${process.env.PORT}`);
  connectDB() ;
});
