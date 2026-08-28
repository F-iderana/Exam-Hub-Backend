import { Router } from "express";
import { authenticate } from "../Security/authMiddleware";
import { requireRole } from "../Security/roleMiddleware";
import { StudentController } from "../Controller/StudentController";

const router = Router();
router.use(authenticate, requireRole("admin"));
router.get("/", StudentController.list);
router.post("/", StudentController.create);
router.put("/:id", StudentController.update);
router.delete("/:id", StudentController.deactivate);
router.post("/:id/reset-password", StudentController.resetPassword);
export default router;