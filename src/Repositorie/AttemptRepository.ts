import { pool } from "../config/db";
import { Attempt } from "../Model/Attempt";

export const AttemptRepository = {
  findByExamAndStudent: async (examId: number, studentId: number): Promise<Attempt | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM attempts WHERE exam_id = $1 AND student_id = $2",
      [examId, studentId]
    );
    return rows[0] || null;
  },

  createWithAnswers: async (
    examId: number,
    studentId: number,
    score: number,
    answers: { question_id: number; choice_id: number | null }[]
  ): Promise<Attempt> => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const aResult = await client.query(
        `INSERT INTO attempts (exam_id, student_id, score) VALUES ($1, $2, $3) RETURNING *`,
        [examId, studentId, score]
      );
      const attempt = aResult.rows[0];
      for (const a of answers) {
        await client.query(
          `INSERT INTO answers (attempt_id, question_id, choice_id) VALUES ($1, $2, $3)`,
          [attempt.id, a.question_id, a.choice_id]
        );
      }
      await client.query("COMMIT");
      return attempt;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  listByExam: async (examId: number) => {
    const { rows } = await pool.query(
      `SELECT a.id, a.score, a.submitted_at, u.id as student_id, u.name as student_name, u.email as student_email
       FROM attempts a JOIN users u ON u.id = a.student_id
       WHERE a.exam_id = $1 ORDER BY a.id`,
      [examId]
    );
    return rows;
  },

  listByStudent: async (studentId: number) => {
    const { rows } = await pool.query(
      `SELECT a.id, a.score, a.submitted_at, e.id as exam_id, e.title as exam_title
       FROM attempts a JOIN exams e ON e.id = a.exam_id
       WHERE a.student_id = $1 ORDER BY a.submitted_at DESC`,
      [studentId]
    );
    return rows;
  },

  getAnswers: async (attemptId: number) => {
    const { rows } = await pool.query("SELECT * FROM answers WHERE attempt_id = $1", [attemptId]);
    return rows;
  },
};