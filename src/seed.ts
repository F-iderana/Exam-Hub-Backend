import dotenv from "dotenv";
import { UserRepository } from "./Repositorie/UserRepository";
import { hashPassword } from "./Security/hash";
import { pool } from "./config/db";

dotenv.config();

const seed = async (): Promise<void> => {
  const email = "admin@examhub.local";
  const existing = await UserRepository.findByEmail(email);
  if (existing) {
    console.log("Admin déjà existant.");
    await pool.end();
    return;
  }
  const hash = await hashPassword("Admin123!");
  await UserRepository.createAdmin("Administrateur", email, hash);
  console.log("Admin créé : email =", email, "/ mot de passe = Admin123!");
  await pool.end();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});