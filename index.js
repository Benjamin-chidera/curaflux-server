import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import "./config/passport.js";
import authRoutes from "./routes/authRoute.js";

const PORT = 3000;
const app = express();
dotenv.config();

// Add the trust proxy setting
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? "curaflux.vercel.app"
          : "localhost",
    },
  })
);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-frontend-domain.com"
        : "http://localhost:5173",
    credentials: true, // Allow cookies to be sent
  })
);


app.use(passport.initialize());
app.use(cookieParser());
app.use(passport.session());

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
