import { Router } from "express";
import {
  createHospital,
  getAllHospitals,
  getHospitalById,
} from "../controllers/hosiptalController.js";
import {
  forgottenPassword,
  resetPassword,
  signIn,
  signUp,
} from "../controllers/hospitalAuthController.js";

const router = Router();

router.post("/createHospital", createHospital);
router.get("/getAllHospitals", getAllHospitals);
router.get("/getHospitalById/:HospitalId", getHospitalById);

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/forgot-Password", forgottenPassword);
router.patch("/reset-Password/:token", resetPassword);

export default router;
