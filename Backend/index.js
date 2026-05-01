import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/connectionDB.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://blogging-website-v5ns.onrender.com", 
  credentials: true
}));

app.use("/images", express.static("uploads"));
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

const PORT = 4000;

console.log("JWT_SECRET:", process.env.JWT_SECRET); 
console.log("MONGO_URL:", process.env.MONGO_URL); 

await connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
