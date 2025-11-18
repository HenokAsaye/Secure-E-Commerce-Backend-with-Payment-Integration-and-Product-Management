import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]); // Fixed: was split('')

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, decodedUser) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid token", error: err.message });
      }

      const user = await User.findById(decodedUser._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Authentication error", error: error.message });
  }
};

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Denied! You don't have permission for this action.",
      });
    }
    next();
  };
};
