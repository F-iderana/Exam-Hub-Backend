import { Router } from "express";
import { authenticate } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";
import { ExamController } from "../Controller/ExamController";
import { QuestionController } from "../Controller/QuestionController";

const router = Router();
router.use(authenticate, requireRole("admin"));
router.get("/", ExamController.list);
router.post("/", ExamController.create);
router.get("/:id", ExamController.getOne);
router.put("/:id", ExamController.update);
router.delete("/:id", ExamController.delete);
router.get("/:id/results", ExamController.results);
router.get("/:id/questions", QuestionController.listByExam);
router.post("/:id/questions", QuestionController.create);
export default router;