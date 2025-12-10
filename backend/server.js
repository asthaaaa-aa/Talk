import express from "express";
import cors from "cors";
import "dotenv/config";
import getGeminiResponse from "./utils/gemini.js";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api" , chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});

const connectDB = async() => {
  try{
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to the database !!!")
  }
  catch(err) {
    console.log("Errrror", err)
  }
  
}