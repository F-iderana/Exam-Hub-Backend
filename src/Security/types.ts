import { Request } from "express";

export interface AuthUser {
  id: number;
  role: "admin" | "student";
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}