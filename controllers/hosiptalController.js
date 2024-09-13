import { Hospital } from "../models/hospital.js";

// POST: Create a new Hospital
export const createHospital = async (req, res) => {
  try {
    const {
      adsNote,
      name,
      date,
      location,
      duration,
      payRate,
      specialization,
      licenseRequired,
    } = req.body;

    // Create a new Hospital instance
    const newHospital = new Hospital({
      adsNote,
      name,
      date,
      location,
      duration,
      payRate,
      specialization,
      licenseRequired,
    });

    // Save the Hospital to the database
    const savedHospital = await newHospital.save();

    // Send back the saved Hospital in the response
    res.status(201).json(savedHospital);
  } catch (error) {
    res.status(500).json({ message: "Error creating the Hospital", error });
  }
};

// GET: Retrieve all Hospitals
export const getAllHospitals = async (req, res) => {
  try {
    // Fetch all Hospitals from the database
    const Hospitals = await Hospital.find();

    // Send back the Hospitals in the response
    res.status(200).json(Hospitals);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Hospitals", error });
  }
};

// GET by ID: Retrieve a single Hospital by its ID
export const getHospitalById = async (req, res) => {
  const { HospitalId } = req.params;

  try {
    // Fetch the Hospital from the database by its ID
    const singleHospital = await Hospital.findById({ _id: HospitalId });

    // If no Hospital is found, return a 404
    if (!singleHospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Send back the Hospital in the response
    res.status(200).json(singleHospital);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error retrieving the Hospital", error });
  }
};
