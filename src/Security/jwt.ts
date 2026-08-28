import jwt from "jsonwebtoken";
import { AuthUser } from "./types";

const SECRET = process.env.JWT_SECRET as string;

export const generateToken = (payload: AuthUser): string => {
  return jwt.sign(payload, SECRET, { expiresIn: "8h" });
};

export const verifyToken = (token: string): AuthUser => {
  return jwt.verify(token, SECRET) as AuthUser;
};