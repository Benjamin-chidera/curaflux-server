import { Application } from "../models/application.js";
import { Shifts } from "../models/hospital.js";
import expressAsync from "express-async-handler";
import User from "../models/user.js";

export const applyForShift = expressAsync(async (req, res) => {
  const { shiftId, userId } = req.body;

  try {
    const shift = await Shifts.findById(shiftId);
    const user = await User.findById(userId);

    console.log(shiftId);

    if (!shift) {
      return res.status(400).json({ message: "Shift not available" });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const existingApplication = await Application.findOne({
      userId,
      shiftId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already applied for this shift please wait for a respond",
      });
    }

    // Create a new application
    const application = new Application({
      userId,
      shiftId,
      hasApplied: true,
    });
    await application.save();

    shift.applicants.push(application._id);
    await shift.save();
    res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// get application for a specific hospital

// export const getApplicationsForHospital = async (req, res) => {
//   const hospitalId = req.user.hospitalId;

//   console.log(hospitalId);

//   try {
//     const applications = await Application.find({ hospitalId })
//       .populate("userId", "fullName email photo gender")
//       .populate("hospitalId");

//     if (applications.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No applications found for this hospital" });
//     }

//     res.status(200).json(applications);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getApplicationsForHospital = async (req, res) => {
  const hospitalId = req.user.hospitalId;

  try {
    // Find all applications where the associated shift's hospital matches the current admin's hospital
    const applications = await Application.find()
      .populate({
        path: "shiftId",
        match: { hospital: hospitalId }, // Match shifts that belong to the admin's hospital
        populate: {
          path: "hospital", // Populate the hospital details
          select: "name", // Select only the required fields for hospital
        },
      })
      .populate("userId"); // Populate the user details

    // Filter out any applications where the shiftId doesn't match the hospitalId
    const filteredApplications = applications.filter(
      (application) => application.shiftId !== null
    );

    if (filteredApplications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this hospital's shifts" });
    }

    res.status(200).json(filteredApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllApplications = expressAsync(async (req, res) => {
  const applications = await Application.find().populate("hospitalId");

  res.status(200).json({ success: true, applications });
});

// accept shifts

export const acceptApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status: "accepted" },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("hospitalId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application accepted", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// reject shifts

export const rejectApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status: "rejected" },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("hospitalId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application rejected", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
