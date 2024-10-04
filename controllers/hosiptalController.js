import { Application } from "../models/application.js";
import { Shifts } from "../models/hospital.js";

// POST: Create a new Hospital
export const createHospital = async (req, res) => {
  try {
    const {
      adsNote,
      date,
      location,
      duration,
      payRate,
      skills,
      jobType,
      specialRequirement,
      shiftSupervisorName,
      shiftSupervisorPosition,
      shiftSupervisorEmail,
      shiftSupervisorPhoneNumber,
    } = req.body;

    const { hospitalId } = req.user;

    // Create a new Hospital instance
    const newHospital = new Shifts({
      adsNote,
      date,
      location,
      duration,
      payRate,
      skills,
      hospital: hospitalId,
      jobType,
      specialRequirement,
      shiftSupervisorName,
      shiftSupervisorPosition,
      shiftSupervisorEmail,
      shiftSupervisorPhoneNumber,
    });

    // Save the Hospital to the database
    const savedHospital = await newHospital.save();

    // Send back the saved Hospital in the response
    res.status(201).json({ success: true, savedHospital });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error creating the Hospital", error });
  }
};

// GET: Retrieve all Hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const appliedShift = await Application.find({ hasApplied: true });

    // Fetch all Hospitals from the database
    const Hospitals = await Shifts.find()
      .sort("-created")
      .populate("hospital", "-password");

    // Send back the Hospitals in the response

    // console.log(appliedShift);

    res.status(200).json({ Hospitals, appliedShift });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Hospitals", error });
  }
};

// GET by ID: Retrieve a single Hospital by its ID
export const getHospitalById = async (req, res) => {
  const { HospitalId } = req.params;

  try {
    // Fetch the Hospital from the database by its ID
    const singleHospital = await Shifts.findById(HospitalId).populate(
      "hospital",
      "-password"
    );

    // If no Hospital is found, return a 404
    if (!singleHospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Fetch all applications with hasApplied true and related to the specific hospital
    const appliedShift = await Application.find({
      hospitalId: HospitalId,
      hasApplied: true,
    });

    // Send back the Hospital and appliedShift in the response
    res.status(200).json({ singleHospital, appliedShift });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving the Hospital", error });
  }
};

export const getShiftForAHealthCare = async (req, res) => {
  const { hospitalId } = req.params;
  try {
    const yourShift = await Shifts.find({ hospital: hospitalId })
      .sort("-created")
      .populate("hospital", "-password");

    if (!yourShift) {
      return res.status(404).json({ message: "Couldn't find your shifts" });
    }

    res.status(200).json({
      msg: "Healthcare Shifts",
      NumOfShifts: yourShift.length,
      yourShift,
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Error retrieving the your created shifts", error });
  }
};

export const searchShift = async (req, res) => {
  const { location } = req.query;

  let queryObj = {};

  try {
    if (location) {
      queryObj.location = { $regex: location, $options: "i" };
    }

    const search = await Shifts.find(queryObj);

    if (search.length === 0) {
      return res
        .status(404)
        .json({ msg: `There are no results for "${location}" ` });
    }

    res.status(200).json({ success: true, search });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Error retrieving the your search result", error });
  }
};
