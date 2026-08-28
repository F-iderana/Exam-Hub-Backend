import { QuestionRepository, ChoiceInput } from "../Repositorie/QuestionRepository";
import { ExamRepository } from "../Repositorie/ExamRepository";
import { AppError } from "../Security/AppError";

const validateChoices = (choices: ChoiceInput[]): void => {
  if (!Array.isArray(choices) || choices.length < 2 || choices.length > 6) {
    throw new AppError(400, "Une question doit avoir entre 2 et 6 choix");
  }
  const correctCount = choices.filter((c) => c.is_correct).length;
  if (correctCount !== 1) {
    throw new AppError(400, "Une question doit avoir exactement un choix correct");
  }
};

export const QuestionService = {
  listByExam: async (examId: number) => {
    const questions = await QuestionRepository.listByExam(examId);
    const result = [];
    for (const q of questions) {
      const choices = await QuestionRepository.listChoices(q.id);
      result.push({ ...q, choices });
    }
    return result;
  },

  create: async (examId: number, statement: string, points: number, choices: ChoiceInput[]) => {
    const exam = await ExamRepository.findById(examId);
    if (!exam) throw new AppError(404, "Examen introuvable");
    const hasAttempts = await ExamRepository.hasAttempts(examId);
    if (hasAttempts) throw new AppError(409, "Examen verrouillé : il possède déjà des tentatives");
    if (!statement || !points || points <= 0) throw new AppError(400, "Énoncé et points valides requis");
    validateChoices(choices);
    return QuestionRepository.createWithChoices(examId, statement, points, choices);
  },

  update: async (id: number, statement: string, points: number, choices: ChoiceInput[]) => {
    const question = await QuestionRepository.findById(id);
    if (!question) throw new AppError(404, "Question introuvable");
    const hasAttempts = await ExamRepository.hasAttempts(question.exam_id);
    if (hasAttempts) throw new AppError(409, "Examen verrouillé : il possède déjà des tentatives");
    if (!statement || !points || points <= 0) throw new AppError(400, "Énoncé et points valides requis");
    validateChoices(choices);
    return QuestionRepository.updateWithChoices(id, statement, points, choices);
  },

  delete: async (id: number) => {
    const question = await QuestionRepository.findById(id);
    if (!question) throw new AppError(404, "Question introuvable");
    const hasAttempts = await ExamRepository.hasAttempts(question.exam_id);
    if (hasAttempts) throw new AppError(409, "Examen verrouillé : il possède déjà des tentatives");
    await QuestionRepository.delete(id);
  },
};