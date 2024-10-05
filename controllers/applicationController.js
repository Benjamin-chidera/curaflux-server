import { Application } from "../models/application.js";
import { Shifts } from "../models/hospital.js";
import expressAsync from "express-async-handler";
import User from "../models/user.js";
import { sendEmail } from "../utils/sendVerificationOtp.js";
import { acceptedMessage,  rejectedMessage } from "../utils/emailTemplate.js";

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

export const getASingleApplication = expressAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await Application.findById(userId).populate("userId");

  // console.log(user);

  res.status(200).json({ success: true, user });
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
      .populate("shiftId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    const userEmail = application.userId.email;

    const msg = "Congratulations💖, you application was successful";

    await sendEmail({
      to: userEmail,
      subject: "Your Application was successful. Welcome to the Family 💖",
      html: acceptedMessage(msg),
    });

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
    const application = await Application.findByIdAndDelete(applicationId).populate("userId", "-password"); // Deletes the application

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    const userEmail = application.userId.email;

   

    const msg =
      "Unfortunately we won't be processing your request at this time";

    await sendEmail({
      to: userEmail,
      subject: "So sorry ",
      html: rejectedMessage(msg),
    });

    res
      .status(200)
      .json({ message: "Application rejected and removed", applicationId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
