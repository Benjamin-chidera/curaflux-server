import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import { errorHandler } from "./middleware/errorHandlers.js";

const PORT = 3000;
const app = express();
dotenv.config();


app.use(errorHandler);
app.use(express.json());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-frontend-domain.com"
        : "http://localhost:5173",
    credentials: true, // Allow cookies to be sent
  })
);

app.get("/", (req, res) => {
  res.send("home page");
});
app.use("/auth", authRoutes);

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
