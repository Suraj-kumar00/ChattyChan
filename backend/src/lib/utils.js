import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  // Generate JWT token
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // sending the token to the client/user
  res.cookie("jwt", token, {
    httpOnly: true, // prevents XSS attacks cross-site scripting attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // Milliseconds
    sameSite: "strict", // CSRF attacks cors-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
