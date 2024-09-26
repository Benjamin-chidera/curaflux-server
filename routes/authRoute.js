import { Router } from "express";

import {
  signUp,
  signIn,
  verifyOTP,
  resendOtp,
  verify,
  getAUsers,
  getUsers,
  forgottenPassword,
  resetPassword,
} from "../controllers/authControllers.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.patch("/verify/:userId", verify);
router.get("/users", getUsers);
router.get("/user/:userId", getAUsers);
router.post("/forgot-Password", forgottenPassword);
router.patch("/reset-Password/:token", resetPassword);

export default router;
