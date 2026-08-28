import { Response, NextFunction } from "express";
import { AuthRequest } from "../Security/types";
import { AttemptService } from "../Service/AttemptService";

export const MyController = {
  listExams: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await AttemptService.listAvailableExamsForStudent(req.user!.id));
    } catch (err) {
      next(err);
    }
  },

  getExam: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await AttemptService.getExamForStudent(Number(req.params.id), req.user!.id));
    } catch (err) {
      next(err);
    }
  },

  submit: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { answers } = req.body;
      const result = await AttemptService.submit(Number(req.params.id), req.user!.id, answers || []);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getResult: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await AttemptService.getMyResultDetail(Number(req.params.id), req.user!.id));
    } catch (err) {
      next(err);
    }
  },

  myResults: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await AttemptService.getMyResults(req.user!.id));
    } catch (err) {
      next(err);
    }
  },
};