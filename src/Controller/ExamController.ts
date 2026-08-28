import { Response, NextFunction } from "express";
import { AuthRequest } from "../Security/types";
import { ExamService } from "../Service/ExamService";
import { AttemptService } from "../Service/AttemptService";

export const ExamController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await ExamService.list());
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await ExamService.getById(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { course_id, title, description, start_at, end_at } = req.body;
      const exam = await ExamService.create(course_id, title, description ?? null, start_at, end_at);
      res.status(201).json(exam);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, description, start_at, end_at } = req.body;
      const exam = await ExamService.update(Number(req.params.id), title, description ?? null, start_at, end_at);
      res.json(exam);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await ExamService.delete(Number(req.params.id));
      res.json({ message: "Examen supprimé" });
    } catch (err) {
      next(err);
    }
  },

  results: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await AttemptService.getExamResults(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },
};