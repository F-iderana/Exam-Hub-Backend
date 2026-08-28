import { pool } from "../config/db";
import { Exam } from "../Model/Exam";

export const ExamRepository = {
  create: async (
    courseId: number,
    title: string,
    description: string | null,
    startAt: Date,
    endAt: Date
  ): Promise<Exam> => {
    const { rows } = await pool.query(
      `INSERT INTO exams (course_id, title, description, start_at, end_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [courseId, title, description, startAt, endAt]
    );
    return rows[0];
  },

  list: async (): Promise<Exam[]> => {
    const { rows } = await pool.query("SELECT * FROM exams ORDER BY id");
    return rows;
  },

  findById: async (id: number): Promise<Exam | null> => {
    const { rows } = await pool.query("SELECT * FROM exams WHERE id = $1", [id]);
    return rows[0] || null;
  },

  update: async (
    id: number,
    title: string,
    description: string | null,
    startAt: Date,
    endAt: Date
  ): Promise<Exam | null> => {
    const { rows } = await pool.query(
      `UPDATE exams SET title = $1, description = $2, start_at = $3, end_at = $4
       WHERE id = $5 RETURNING *`,
      [title, description, startAt, endAt, id]
    );
    return rows[0] || null;
  },

  delete: async (id: number): Promise<void> => {
    await pool.query("DELETE FROM exams WHERE id = $1", [id]);
  },

  hasAttempts: async (id: number): Promise<boolean> => {
    const { rows } = await pool.query("SELECT 1 FROM attempts WHERE exam_id = $1 LIMIT 1", [id]);
    return rows.length > 0;
  },

  listAvailableForStudent: async (now: Date): Promise<Exam[]> => {
    const { rows } = await pool.query(
      `SELECT e.* FROM exams e WHERE e.start_at <= $1 AND e.end_at >= $1 ORDER BY e.id`,
      [now]
    );
    return rows;
  },
};