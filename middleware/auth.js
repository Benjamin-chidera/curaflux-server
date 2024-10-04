import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ err: "Invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];
  // console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ err: "Token is missing" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);

    req.user = payload;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const permission = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ err: "Unauthorized to perform this action" });
    }
    next();
  };
};
