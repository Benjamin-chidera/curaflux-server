import { HospitalAuth } from "../models/hospitalAuth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { Otp } from "../models/otpModel.js";
import { sendEmail } from "../utils/sendVerificationOtp.js";
import randomstring from "randomstring";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  generateForgotPasswordEmailTemplate,
  generateOtpEmailTemplate,
  generateWelcomeEmailTemplate,
} from "../utils/emailTemplate.js";

export const signUp = expressAsyncHandler(async (req, res) => {
  const {
    email,
    password,
    hospitalName,
    phoneNumber,
    address,
    hospitalType,
    LicenseNumber,
    role,
  } = req.body;

  // Check if HospitalAuth already exists
  const existingHospital = await HospitalAuth.findOne({ email });
  if (existingHospital) {
    return res.status(400).json({ message: "Hospital email already exists" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  // Hash the password and create the new HospitalAuth
  const hashedPassword = await bcrypt.hash(password, 10);
  const newHospitalAuth = new HospitalAuth({
    email,
    password: hashedPassword,
    hospitalName,
    phoneNumber,
    address,
    hospitalType,
    LicenseNumber,
    role,
  });
  await newHospitalAuth.save();

  // Generate JWT token
  const token = jwt.sign(
    {
      hospitalId: newHospitalAuth._id,
      hospitalName: newHospitalAuth.hospitalName,
      email: newHospitalAuth.email,
      phoneNumber: newHospitalAuth.phoneNumber,
      address: newHospitalAuth.address,
      hospitalType: newHospitalAuth.hospitalType,
      LicenseNumber: newHospitalAuth.LicenseNumber,
      role: newHospitalAuth.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // Generate and send OTP after saving HospitalAuth details
  await sendOTP(email);

  const msg =
    "Please complete all your necessary verifications the enjoy the power of an hospital administrator";

  await sendEmail({
    to: email,
    subject: "Your Registration was success. Welcome to the Family 💖",
    html: generateWelcomeEmailTemplate(msg),
  });

  res
    .status(201)
    .json({ success: true, message: "Successful registration", token });
});

export const signIn = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(password);

  // Find user and validate password
  const hospital = await HospitalAuth.findOne({ email });
  if (!hospital) {
    return res.status(400).json({ message: "Hospital not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, hospital.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid hospital credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      hospitalId: hospital._id,
      hospitalName: hospital.hospitalName,
      email: hospital.email,
      phoneNumber: hospital.phoneNumber,
      address: hospital.address,
      hospitalType: hospital.hospitalType,
      LicenseNumber: hospital.LicenseNumber,
      role: hospital.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ message: "Successful login", token, success: true });
});

// Generate OTP
function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}

// Send OTP to the provided email
// Send OTP to the provided email
export const sendOTP = async (email) => {
  try {
    const otp = generateOTP(); // Generate a 6-digit OTP

    // Await the hashing of OTP
    // const hashedOtp = await bcrypt.hash(otp, 10);

    const newOTP = new Otp({
      email,
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // OTP valid for 1 hour
    });
    await newOTP.save();

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Your OTP",
      html: generateOtpEmailTemplate(otp),
    });

    // You can log the success or perform other actions here if needed
    console.log("OTP sent successfully to:", email);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      throw Error("Please verify your otp");
    }

    const existingOTP = await Otp.findOneAndDelete({ otp });

    if (existingOTP) {
      // OTP is valid
      res
        .status(200)
        .json({ success: true, message: "OTP verification successful" });
    } else {
      // OTP is invalid
      res.status(400).json({
        success: false,
        error: "Invalid OTP, Please enter the correct OTP",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const resendOtp = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw Error("Input your email address");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(400).json({ message: "Invalid Email Address" });
    }

    await Otp.findOneAndDelete({ email });

    await sendOTP(email);

    res.status(200).json({ success: true, message: "your otp has been sent" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export const forgottenPassword = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  const hospital = await HospitalAuth.findOne({ email });

  if (!hospital) {
    throw new Error(`hospital not found`);
  }

  const token = jwt.sign(
    {
      hospitalId: hospital._id,
      hospitalName: hospital.hospitalName,
      email: hospital.email,
      phoneNumber: hospital.phoneNumber,
      address: hospital.address,
      hospitalType: hospital.hospitalType,
      LicenseNumber: hospital.LicenseNumber,
      role: hospital.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );

  const resetLink = `http://localhost:5173/admin/reset-password/${token}`; //added in the frontend

  const subject = "Password Reset Request";
  const html = generateForgotPasswordEmailTemplate(resetLink);
  const to = email;
  try {
    await sendEmail({ subject, html, to });
    res.status(200).json({
      success: true,
      msg: "Password reset email sent successfully",
      token,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export const resetPassword = expressAsyncHandler(async (req, res) => {
  const { token } = req.params;

  const { password } = req.body;

  const decodedToken = jwt.verify(token, process.env.TOKEN);
  const userId = decodedToken.userId;

  const user = await HospitalAuth.findById(userId);

  if (!user) {
    throw new Error({ msg: "user not found" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  const hased = await bcrypt.hash(password, 10);

  user.password = hased;

  await user.save();

  const msg = "You can click to login";

  await sendEmail({
    to: user.email,
    subject: "Password was reset successful 🧑‍⚕️😷",
    html: generateWelcomeEmailTemplate(msg),
  });

  res.status(200).json({ msg: "Password successfully changed", success: true });
});
