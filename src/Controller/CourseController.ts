import { Response, NextFunction } from "express";
import { AuthRequest } from "../Security/types";
import { CourseService } from "../Service/CourseService";

export const CourseController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await CourseService.list());
    } catch (err) {
      next(err);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code, name, description } = req.body;
      const course = await CourseService.create(code, name, description ?? null);
      res.status(201).json(course);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, description } = req.body;
      const course = await CourseService.update(Number(req.params.id), name, description ?? null);
      res.json(course);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await CourseService.delete(Number(req.params.id));
      res.json({ message: "Cours supprimé" });
    } catch (err) {
      next(err);
    }
  },
};