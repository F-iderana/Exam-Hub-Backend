import { ExamRepository } from "../Repositorie/ExamRepository";
import { QuestionRepository } from "../Repositorie/QuestionRepository";
import { AttemptRepository } from "../Repositorie/AttemptRepository";
import { AppError } from "../Security/AppError";

export const AttemptService = {
  listAvailableExamsForStudent: async (studentId: number) => {
    const now = new Date();
    const exams = await ExamRepository.listAvailableForStudent(now);
    const result = [];
    for (const exam of exams) {
      const attempt = await AttemptRepository.findByExamAndStudent(exam.id, studentId);
      if (!attempt) result.push(exam);
    }
    return result;
  },

  getExamForStudent: async (examId: number, studentId: number) => {
    const exam = await ExamRepository.findById(examId);
    if (!exam) throw new AppError(404, "Examen introuvable");

    const now = new Date();
    if (now < new Date(exam.start_at) || now > new Date(exam.end_at)) {
      throw new AppError(403, "L'examen n'est pas dans sa fenêtre de disponibilité");
    }

    const existing = await AttemptRepository.findByExamAndStudent(examId, studentId);
    if (existing) throw new AppError(409, "Vous avez déjà passé cet examen");

    const questions = await QuestionRepository.listByExam(examId);
    const result = [];
    for (const q of questions) {
      const choices = await QuestionRepository.listChoices(q.id);
      result.push({
        id: q.id,
        statement: q.statement,
        points: q.points,
        choices: choices.map((c) => ({ id: c.id, text: c.text })),
      });
    }
    return { exam, questions: result };
  },

  submit: async (
    examId: number,
    studentId: number,
    submittedAnswers: { question_id: number; choice_id: number | null }[]
  ) => {
    const exam = await ExamRepository.findById(examId);
    if (!exam) throw new AppError(404, "Examen introuvable");

    const now = new Date();
    if (now < new Date(exam.start_at) || now > new Date(exam.end_at)) {
      throw new AppError(403, "L'examen n'est pas dans sa fenêtre de disponibilité");
    }

    const existing = await AttemptRepository.findByExamAndStudent(examId, studentId);
    if (existing) throw new AppError(409, "Vous avez déjà passé cet examen");

    const questions = await QuestionRepository.listByExam(examId);
    let score = 0;
    const answersToSave: { question_id: number; choice_id: number | null }[] = [];

    for (const q of questions) {
      const submitted = submittedAnswers.find((a) => a.question_id === q.id);
      const choiceId = submitted ? submitted.choice_id : null;

      if (choiceId !== null) {
        const choices = await QuestionRepository.listChoices(q.id);
        const chosen = choices.find((c) => c.id === choiceId);
        if (chosen && chosen.is_correct) score += Number(q.points);
      }
      answersToSave.push({ question_id: q.id, choice_id: choiceId });
    }

    const attempt = await AttemptRepository.createWithAnswers(examId, studentId, score, answersToSave);
    return AttemptService.buildCorrection(attempt.id);
  },

  buildCorrection: async (attemptId: number) => {
    const answers = await AttemptRepository.getAnswers(attemptId);
    const result = [];
    let totalPoints = 0;
    for (const ans of answers) {
      const question = await QuestionRepository.findById(ans.question_id);
      if (!question) continue;
      const choices = await QuestionRepository.listChoices(question.id);
      totalPoints += Number(question.points);
      result.push({
        question_id: question.id,
        statement: question.statement,
        points: question.points,
        choices: choices.map((c) => ({ id: c.id, text: c.text, is_correct: c.is_correct })),
        selected_choice_id: ans.choice_id,
      });
    }
    return { attempt_id: attemptId, total_points: totalPoints, questions: result };
  },

  getExamResults: async (examId: number) => {
    const exam = await ExamRepository.findById(examId);
    if (!exam) throw new AppError(404, "Examen introuvable");
    const attempts = await AttemptRepository.listByExam(examId);
    const scores = attempts.map((a: any) => Number(a.score));
    const average = scores.length ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
    return { exam, attempts, average, count: attempts.length };
  },

  getMyResults: async (studentId: number) => AttemptRepository.listByStudent(studentId),

  getMyResultDetail: async (examId: number, studentId: number) => {
    const attempt = await AttemptRepository.findByExamAndStudent(examId, studentId);
    if (!attempt) throw new AppError(404, "Aucune tentative pour cet examen");
    return AttemptService.buildCorrection(attempt.id);
  },
};