import { pool } from "../config/db";
import { User } from "../Model/User";

export const UserRepository = {
  findByEmail: async (email: string): Promise<User | null> => {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0] || null;
  },

  findById: async (id: number): Promise<User | null> => {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0] || null;
  },

  createAdmin: async (name: string, email: string, passwordHash: string): Promise<User> => {
    const { rows } = await pool.query(
      `INSERT INTO users (role, name, email, password_hash, active)
       VALUES ('admin', $1, $2, $3, TRUE) RETURNING *`,
      [name, email, passwordHash]
    );
    return rows[0];
  },

  createStudent: async (name: string, email: string, passwordHash: string): Promise<User> => {
    const { rows } = await pool.query(
      `INSERT INTO users (role, name, email, password_hash, active)
       VALUES ('student', $1, $2, $3, TRUE) RETURNING *`,
      [name, email, passwordHash]
    );
    return rows[0];
  },

  listStudents: async (): Promise<User[]> => {
    const { rows } = await pool.query("SELECT * FROM users WHERE role = 'student' ORDER BY id");
    return rows;
  },

  updateStudent: async (id: number, name: string, email: string): Promise<User | null> => {
    const { rows } = await pool.query(
      `UPDATE users SET name = $1, email = $2 WHERE id = $3 AND role = 'student' RETURNING *`,
      [name, email, id]
    );
    return rows[0] || null;
  },

  resetPassword: async (id: number, passwordHash: string): Promise<void> => {
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, id]);
  },

  deactivate: async (id: number): Promise<void> => {
    await pool.query("UPDATE users SET active = FALSE WHERE id = $1 AND role = 'student'", [id]);
  },
};