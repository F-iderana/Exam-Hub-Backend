import { Router } from "express";
import { authenticate } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";
import { CourseController } from "../Controller/CourseController";

const router = Router();
router.use(authenticate, requireRole("admin"));
router.get("/", CourseController.list);
router.post("/", CourseController.create);
router.put("/:id", CourseController.update);
router.delete("/:id", CourseController.delete);
export default router;