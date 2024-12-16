import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("token", token, {
    httpOnly: true, // prevents XSS attacks cross-site scripting attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // Milliseconds
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
