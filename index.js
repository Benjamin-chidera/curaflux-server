import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import hospitalRoute from "./routes/hospitalRoute.js";
import { errorHandler } from "./middleware/errorHandlers.js";
import { v2 as cloudinary } from "cloudinary";
import fileupload from "express-fileupload";

const PORT = 3000;
const app = express();
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(errorHandler);
app.use(express.json());

app.use(
  fileupload({
    useTempFiles: true,
  })
);

app.use(
  cors()
);

app.get("/", (req, res) => {
  res.send("home page");
});
app.use("/auth", authRoutes);
app.use("/hospital", hospitalRoute);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      dbName: "Curaflux",
    });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

startServer();
