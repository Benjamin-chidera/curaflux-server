import { Router } from "express";
import {
  createHospital,
  getAllHospitals,
  getHospitalById,
  getShiftForAHealthCare,
  searchShift,
} from "../controllers/hosiptalController.js";
import {
  forgottenPassword,
  resetPassword,
  signIn,
  signUp,
} from "../controllers/hospitalAuthController.js";
import { permission, protect } from "../middleware/auth.js";

const router = Router();

router.post(
  "/createHospital",
  protect,
  permission("healthcare"),
  createHospital
);
router.get(
  "/getAllHospitals",
  protect,
  permission("healthcare", "locum"),
  getAllHospitals
);
router.get("/q/shifts", searchShift);

router.get(
  "/getHospitalById/:HospitalId",
  protect,
  permission("healthcare", "locum"),
  getHospitalById
);

router.get("/getShiftForAHealthCare/:hospitalId", getShiftForAHealthCare);


// Authentication
router.post("/register", signUp);
router.post("/login", signIn);
router.post("/forgot-Password", forgottenPassword);
router.patch("/reset-Password/:healthcareToken", resetPassword);

export default router;
