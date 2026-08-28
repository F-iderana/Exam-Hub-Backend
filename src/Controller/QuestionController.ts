import { Response, NextFunction } from "express";
import { AuthRequest } from "../Security/types";
import { QuestionService } from "../Service/QuestionService";

export const QuestionController = {
  listByExam: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await QuestionService.listByExam(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { statement, points, choices } = req.body;
      const question = await QuestionService.create(Number(req.params.id), statement, points, choices);
      res.status(201).json(question);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { statement, points, choices } = req.body;
      const question = await QuestionService.update(Number(req.params.id), statement, points, choices);
      res.json(question);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await QuestionService.delete(Number(req.params.id));
      res.json({ message: "Question supprimée" });
    } catch (err) {
      next(err);
    }
  },
};