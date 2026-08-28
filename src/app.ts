import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import { errorHandler } from "./Security/errorHandler";
import { pool } from "./config/db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query("SELECT 1");
    res.json({ message: "OK, backend et DB connectés" });
  } catch {
    res.status(500).json({ message: "Erreur connexion DB" });
  }
};

app.get("/api/health", healthCheck);
app.use("/api", routes);
app.use(errorHandler);

export default app;