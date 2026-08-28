import { pool } from "../config/db";
import { Question } from "../Model/Question";
import { Choice } from "../Model/Choice";

export interface ChoiceInput {
  text: string;
  is_correct: boolean;
}

export const QuestionRepository = {
  listByExam: async (examId: number): Promise<Question[]> => {
    const { rows } = await pool.query("SELECT * FROM questions WHERE exam_id = $1 ORDER BY id", [examId]);
    return rows;
  },

  findById: async (id: number): Promise<Question | null> => {
    const { rows } = await pool.query("SELECT * FROM questions WHERE id = $1", [id]);
    return rows[0] || null;
  },

  listChoices: async (questionId: number): Promise<Choice[]> => {
    const { rows } = await pool.query("SELECT * FROM choices WHERE question_id = $1 ORDER BY id", [questionId]);
    return rows;
  },

  createWithChoices: async (
    examId: number,
    statement: string,
    points: number,
    choices: ChoiceInput[]
  ): Promise<Question> => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const qResult = await client.query(
        `INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING *`,
        [examId, statement, points]
      );
      const question = qResult.rows[0];
      for (const c of choices) {
        await client.query(
          `INSERT INTO choices (question_id, text, is_correct) VALUES ($1, $2, $3)`,
          [question.id, c.text, c.is_correct]
        );
      }
      await client.query("COMMIT");
      return question;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  updateWithChoices: async (
    id: number,
    statement: string,
    points: number,
    choices: ChoiceInput[]
  ): Promise<Question | null> => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const qResult = await client.query(
        `UPDATE questions SET statement = $1, points = $2 WHERE id = $3 RETURNING *`,
        [statement, points, id]
      );
      const question = qResult.rows[0];
      if (!question) {
        await client.query("ROLLBACK");
        return null;
      }
      await client.query("DELETE FROM choices WHERE question_id = $1", [id]);
      for (const c of choices) {
        await client.query(
          `INSERT INTO choices (question_id, text, is_correct) VALUES ($1, $2, $3)`,
          [id, c.text, c.is_correct]
        );
      }
      await client.query("COMMIT");
      return question;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  delete: async (id: number): Promise<void> => {
    await pool.query("DELETE FROM questions WHERE id = $1", [id]);
  },
};