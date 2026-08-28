import { CourseRepository } from "../Repositorie/CourseRepository";
import { AppError } from "../Security/AppError";

export const CourseService = {
  list: async () => CourseRepository.list(),

  create: async (code: string, name: string, description: string | null) => {
    if (!code || !name) throw new AppError(400, "Code et nom requis");
    return CourseRepository.create(code, name, description);
  },

  update: async (id: number, name: string, description: string | null) => {
    const course = await CourseRepository.update(id, name, description);
    if (!course) throw new AppError(404, "Cours introuvable");
    return course;
  },

  delete: async (id: number) => {
    const course = await CourseRepository.findById(id);
    if (!course) throw new AppError(404, "Cours introuvable");
    const hasExams = await CourseRepository.hasExams(id);
    if (hasExams) throw new AppError(409, "Impossible de supprimer un cours possédant des examens");
    await CourseRepository.delete(id);
  },
};