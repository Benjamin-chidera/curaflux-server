import { Router } from "express";

import {
  signUp,
  signIn,
  verifyOTP,
  resendOtp,
  verify,
  getAUsers,
  getUsers,
} from "../controllers/authControllers.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.patch("/verify/:userId", verify);
router.get("/users", getUsers);
router.get("/user/:userId", getAUsers);

export default router;

// import { Router } from "express";
// import { signUp, googleSignIn } from "../controllers/authControllers.js";
// import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

// const router = Router();

// router.post("/signup", verifyFirebaseToken, signUp);
// router.post("/google", googleSignIn);

// export default router;
