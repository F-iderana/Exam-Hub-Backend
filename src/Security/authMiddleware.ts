import { Response, NextFunction } from "express";
import { AuthRequest } from "./types";
import { verifyToken } from "./jwt";
import { AppError } from "./AppError";

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next(new AppError(401, "Authentification requise"));
    return;
  }
  const token = header.split(" ")[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError(401, "Token invalide ou expiré"));
  }
};