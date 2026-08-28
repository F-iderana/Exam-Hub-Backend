import { Request, Response, NextFunction } from "express";
import { AuthService } from "../Service/AuthService";

export const AuthController = {
  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};