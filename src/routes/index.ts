import { Router } from "express";
import authRoutes from "./authRoutes";
import studentRoutes from "./studentRoutes";
import courseRoutes from "./courseRoutes";
import examRoutes from "./examRoutes";
import questionRoutes from "./questionRoutes";
import myRoutes from "./myRoutes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/courses", courseRoutes);
router.use("/exams", examRoutes);
router.use("/questions", questionRoutes);
router.use("/my", myRoutes);
export default router;