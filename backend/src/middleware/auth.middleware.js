import jwt from "jsonwebtoken";
import User from "../models/user.models";

export const protectRoute = async (req, res, next) => {
  try {
    const token = res.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unathorized - Invalid Token" });
    }
  } catch (error) {}
};
