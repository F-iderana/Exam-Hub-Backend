import { ExamRepository } from "../Repositorie/ExamRepository";
import { CourseRepository } from "../Repositorie/CourseRepository";
import { AppError } from "../Security/AppError";

export const ExamService = {
  list: async () => ExamRepository.list(),

  getById: async (id: number) => {
    const exam = await ExamRepository.findById(id);
    if (!exam) throw new AppError(404, "Examen introuvable");
    return exam;
  },

  create: async (
    courseId: number,
    title: string,
    description: string | null,
    startAt: string,
    endAt: string
  ) => {
    const course = await CourseRepository.findById(courseId);
    if (!course) throw new AppError(400, "Cours introuvable");
    if (!title) throw new AppError(400, "Titre requis");

    const start = new Date(startAt);
    const end = new Date(endAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      throw new AppError(400, "Fenêtre de disponibilité invalide");
    }
    return ExamRepository.create(courseId, title, description, start, end);
  },

  update: async (
    id: number,
    title: string,
    description: string | null,
    startAt: string,
    endAt: string
  ) => {
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      throw new AppError(400, "Fenêtre de disponibilité invalide");
    }
    const exam = await ExamRepository.update(id, title, description, start, end);
    if (!exam) throw new AppError(404, "Examen introuvable");
    return exam;
  },

  delete: async (id: number) => {
    const exam = await ExamRepository.findById(id);
    if (!exam) throw new AppError(404, "Examen introuvable");
    const hasAttempts = await ExamRepository.hasAttempts(id);
    if (hasAttempts) throw new AppError(409, "Impossible de supprimer un examen possédant des tentatives");
    await ExamRepository.delete(id);
  },
};