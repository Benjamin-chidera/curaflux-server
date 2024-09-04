import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

export const signUp = expressAsyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, photo, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    photo,
    role,
  });
  await newUser.save();

  const token = jwt.sign(
    {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      email: newUser.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // res.cookie("token", token, {
  //   // httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   maxAge: 3600000, // 1 hour
  // });

  res.status(201).json({ message: "Successful registration", token });

  res.status(500).json({ message: "Server error" });
});

export const signIn = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordCorrect = bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // res.cookie("token", token, {
  //   // httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   maxAge: 3600000, // 1 hour
  // });

  res.status(200).json({ message: "Successful login", token });

  res.status(500).json({ message: "Server error" });
});
