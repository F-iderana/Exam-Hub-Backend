import { pool } from "../config/db";
import { Course } from "../Model/Course";

export const CourseRepository = {
  create: async (code: string, name: string, description: string | null): Promise<Course> => {
    const { rows } = await pool.query(
      `INSERT INTO courses (code, name, description) VALUES ($1, $2, $3) RETURNING *`,
      [code, name, description]
    );
    return rows[0];
  },

  list: async (): Promise<Course[]> => {
    const { rows } = await pool.query("SELECT * FROM courses ORDER BY id");
    return rows;
  },

  findById: async (id: number): Promise<Course | null> => {
    const { rows } = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    return rows[0] || null;
  },

  update: async (id: number, name: string, description: string | null): Promise<Course | null> => {
    const { rows } = await pool.query(
      `UPDATE courses SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description, id]
    );
    return rows[0] || null;
  },

  delete: async (id: number): Promise<void> => {
    await pool.query("DELETE FROM courses WHERE id = $1", [id]);
  },

  hasExams: async (id: number): Promise<boolean> => {
    const { rows } = await pool.query("SELECT 1 FROM exams WHERE course_id = $1 LIMIT 1", [id]);
    return rows.length > 0;
  },
};