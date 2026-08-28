import { Response, NextFunction } from "express";
import { AuthRequest } from "./types";
import { AppError } from "./AppError";

export const requireRole = (role: "admin" | "student") =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      next(new AppError(403, "Accès non autorisé"));
      return;
    }
    next();
  };