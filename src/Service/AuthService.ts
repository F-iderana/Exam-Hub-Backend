import { UserRepository } from "../Repositorie/UserRepository";
import { comparePassword } from "../Security/hash";
import { generateToken } from "../Security/jwt";
import { AppError } from "../Security/AppError";

export const AuthService = {
  login: async (email: string, password: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError(401, "Email ou mot de passe incorrect");
    if (!user.active) throw new AppError(403, "Compte désactivé");

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) throw new AppError(401, "Email ou mot de passe incorrect");

    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },
};