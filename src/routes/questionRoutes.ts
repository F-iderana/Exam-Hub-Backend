import { Router } from "express";
import { authenticate } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";
import { QuestionController } from "../Controller/QuestionController";

const router = Router();
router.use(authenticate, requireRole("admin"));
router.put("/:id", QuestionController.update);
router.delete("/:id", QuestionController.delete);
export default router;