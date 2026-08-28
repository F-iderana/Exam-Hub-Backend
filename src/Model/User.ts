export interface User {
  id: number;
  role: "admin" | "student";
  name: string;
  email: string;
  password_hash: string;
  active: boolean;
  created_at: Date;
}