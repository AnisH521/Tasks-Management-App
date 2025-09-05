import jwt from "jsonwebtoken";
import config from "config";

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, config.get("jwt.access_token_secret"), {
    expiresIn: "1d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "none", // Helps prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });
};
