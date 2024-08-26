import { Router } from "express";
import passport from "passport";
import {
  signUp,
  signIn,
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
} from "../controllers/authControllers.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthCallback
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  facebookAuthCallback
);

export default router;
