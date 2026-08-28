import { Response, NextFunction } from "express";
import { AuthRequest } from "../Security/types";
import { StudentService } from "../Service/StudentService";

export const StudentController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await StudentService.list());
    } catch (err) {
      next(err);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const student = await StudentService.create(name, email, password);
      res.status(201).json(student);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email } = req.body;
      const student = await StudentService.update(Number(req.params.id), name, email);
      res.json(student);
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { password } = req.body;
      await StudentService.resetPassword(Number(req.params.id), password);
      res.json({ message: "Mot de passe réinitialisé" });
    } catch (err) {
      next(err);
    }
  },

  deactivate: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await StudentService.deactivate(Number(req.params.id));
      res.json({ message: "Compte désactivé" });
    } catch (err) {
      next(err);
    }
  },
};