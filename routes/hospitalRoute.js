import { Router } from "express";
import {
  createHospital,
  getAllHospitals,
  getHospitalById,
} from "../controllers/hosiptalController.js";

const router = Router();

router.post("/createHospital", createHospital);
router.get("/getAllHospitals", getAllHospitals);
router.get("/getHospitalById/:HospitalId", getHospitalById);


export default router;
