import { UserRepository } from "../Repositorie/UserRepository";
import { hashPassword } from "../Security/hash";
import { AppError } from "../Security/AppError";

export const StudentService = {
  list: async () => {
    const students = await UserRepository.listStudents();
    return students.map(({ password_hash, ...rest }) => rest);
  },

  create: async (name: string, email: string, initialPassword: string) => {
    if (!name || !email || !initialPassword) {
      throw new AppError(400, "Nom, email et mot de passe initial requis");
    }
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw new AppError(409, "Un compte existe déjà avec cet email");

    const hash = await hashPassword(initialPassword);
    const student = await UserRepository.createStudent(name, email, hash);
    const { password_hash, ...rest } = student;
    return rest;
  },

  update: async (id: number, name: string, email: string) => {
    const updated = await UserRepository.updateStudent(id, name, email);
    if (!updated) throw new AppError(404, "Étudiant introuvable");
    const { password_hash, ...rest } = updated;
    return rest;
  },

  resetPassword: async (id: number, newPassword: string) => {
    const student = await UserRepository.findById(id);
    if (!student || student.role !== "student") throw new AppError(404, "Étudiant introuvable");
    const hash = await hashPassword(newPassword);
    await UserRepository.resetPassword(id, hash);
  },

  deactivate: async (id: number) => {
    const student = await UserRepository.findById(id);
    if (!student || student.role !== "student") throw new AppError(404, "Étudiant introuvable");
    await UserRepository.deactivate(id);
  },
};