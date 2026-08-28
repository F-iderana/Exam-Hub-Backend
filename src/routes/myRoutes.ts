import { Router } from "express";
import { authenticate } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";
import { MyController } from "../Controller/MyController";

const router = Router();
router.use(authenticate, requireRole("student"));
router.get("/exams", MyController.listExams);
router.get("/exams/:id", MyController.getExam);
router.post("/exams/:id/submit", MyController.submit);
router.get("/exams/:id/result", MyController.getResult);
router.get("/results", MyController.myResults);
export default router;