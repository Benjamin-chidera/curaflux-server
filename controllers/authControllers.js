import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { email, password, firstName, lastName, photo, role } = req.body;

  try {
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

    res.cookie("token", token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    // res.status(201).json({ message: "Successful registration", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
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

    res.cookie("token", token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    // res.status(200).json({ message: "Successful login", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const googleAuth = (req, res) => {
  res.redirect("/auth/google");
};


// export const googleAuthCallback = (req, res) => {
//   const token = jwt.sign(
//     {
//       id: req.user._id,
//       firstName: req.user.firstName,
//       lastName: req.user.lastName,
//       role: req.user.role,
//       email: req.user.email,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "1h",
//     }
//   );

//   res.cookie("token", token, {
//     // httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 3600000, // 1 hour
//     // domain: "https://curaflux.vercel.app",
//   });

//   console.log(token);
  

//   // res.json({ message: "Successful", token });

//   // res.status(200).json({ message: "Successful login", token });

//   res.redirect("http://localhost:5173/admin"); // Redirect to your client-side dashboard
//   // res.redirect("http://localhost:5173/admin"); // Redirect to your client-side dashboard
// };

export const googleAuthCallback = (req, res) => {
  const token = jwt.sign(
    {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      email: req.user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

 res.cookie("token", token, {
   httpOnly: true,
   secure: process.env.NODE_ENV === "production", // Secure in production
   maxAge: 3600000,
   domain:
     process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost",
   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
 });


  console.log("JWT Token:", token);

  // Redirect to client-side dashboard based on environment
  const redirectUrl =
    process.env.NODE_ENV === "production"
      ? "https://curaflux.vercel.app/admin"
      : "http://localhost:5173/admin";

  res.redirect(redirectUrl);
};
