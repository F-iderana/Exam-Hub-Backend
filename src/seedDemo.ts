import dotenv from "dotenv";
import { pool } from "./config/db";
import { UserRepository } from "./Repositorie/UserRepository";
import { CourseRepository } from "./Repositorie/CourseRepository";
import { hashPassword } from "./Security/hash";

dotenv.config();

const courses = [
  { code: "INFO-L1", name: "Informatique en L1", description: "Fondamentaux de la programmation" },
  { code: "PROG2", name: "Programmation 2", description: "Structures de donnees et algorithmique" },
  { code: "MATH-L1", name: "Mathematiques en L1", description: "Algebre et analyse de base" },
  { code: "RESO-L2", name: "Reseaux L2", description: "Introduction aux reseaux informatiques" },
  { code: "BDD-L2", name: "Bases de donnees L2", description: "Modelisation et SQL" },
];

const students = [
  { name: "Sitraka Andrianina", email: "sitraka.andrianina@examhub.local" },
  { name: "Voahangy Rakoto", email: "voahangy.rakoto@examhub.local" },
  { name: "Tojo Rabe", email: "tojo.rabe@examhub.local" },
  { name: "Miora Randria", email: "miora.randria@examhub.local" },
  { name: "Fetra Rasolofo", email: "fetra.rasolofo@examhub.local" },
];

const STUDENT_PASSWORD = "Etudiant2026!";

const examsData = [
  {
    courseCode: "INFO-L1",
    title: "Examen Algorithmique - Semestre 1",
    description: "Bases de la programmation",
    questions: [
      {
        statement: "Quel mot-cle declare une variable constante en JavaScript ?",
        points: 2,
        choices: [
          { text: "const", is_correct: true },
          { text: "var", is_correct: false },
          { text: "let", is_correct: false },
        ],
      },
      {
        statement: "Quelle structure repete un bloc de code tant qu'une condition est vraie ?",
        points: 2,
        choices: [
          { text: "if", is_correct: false },
          { text: "while", is_correct: true },
          { text: "switch", is_correct: false },
        ],
      },
    ],
  },
  {
    courseCode: "PROG2",
    title: "Examen Structures de donnees",
    description: "Piles, files et listes chainees",
    questions: [
      {
        statement: "Quelle structure fonctionne selon le principe LIFO ?",
        points: 2,
        choices: [
          { text: "File (Queue)", is_correct: false },
          { text: "Pile (Stack)", is_correct: true },
          { text: "Arbre binaire", is_correct: false },
        ],
      },
      {
        statement: "Quelle est la complexite moyenne d'une recherche dans une liste chainee ?",
        points: 2,
        choices: [
          { text: "O(1)", is_correct: false },
          { text: "O(log n)", is_correct: false },
          { text: "O(n)", is_correct: true },
        ],
      },
    ],
  },
  {
    courseCode: "MATH-L1",
    title: "Examen Algebre",
    description: "Equations et fonctions",
    questions: [
      {
        statement: "Quelle est la derivee de x² ?",
        points: 2,
        choices: [
          { text: "x", is_correct: false },
          { text: "2x", is_correct: true },
          { text: "x²", is_correct: false },
        ],
      },
      {
        statement: "Combien de solutions reelles a l'equation x² + 1 = 0 ?",
        points: 2,
        choices: [
          { text: "0", is_correct: true },
          { text: "1", is_correct: false },
          { text: "2", is_correct: false },
        ],
      },
    ],
  },
  {
    courseCode: "RESO-L2",
    title: "Examen Reseaux",
    description: "Modele OSI et protocoles",
    questions: [
      {
        statement: "Combien de couches compte le modele OSI ?",
        points: 2,
        choices: [
          { text: "5", is_correct: false },
          { text: "7", is_correct: true },
          { text: "9", is_correct: false },
        ],
      },
      {
        statement: "Quel protocole est utilise pour resoudre un nom de domaine en adresse IP ?",
        points: 2,
        choices: [
          { text: "DNS", is_correct: true },
          { text: "HTTP", is_correct: false },
          { text: "FTP", is_correct: false },
        ],
      },
    ],
  },
  {
    courseCode: "BDD-L2",
    title: "Examen Bases de donnees",
    description: "SQL et modelisation relationnelle",
    questions: [
      {
        statement: "Quelle commande SQL permet de recuperer des donnees ?",
        points: 2,
        choices: [
          { text: "SELECT", is_correct: true },
          { text: "INSERT", is_correct: false },
          { text: "DELETE", is_correct: false },
        ],
      },
      {
        statement: "Quelle contrainte garantit l'unicite d'une valeur dans une colonne ?",
        points: 2,
        choices: [
          { text: "CHECK", is_correct: false },
          { text: "UNIQUE", is_correct: true },
          { text: "DEFAULT", is_correct: false },
        ],
      },
    ],
  },
];

const seedDemo = async (): Promise<void> => {
  console.log("=== Creation des cours ===");
  const courseIdByCode: Record<string, number> = {};
  for (const c of courses) {
    const existingCourses = await CourseRepository.list();
    const found = existingCourses.find((ec) => ec.code === c.code);
    if (found) {
      courseIdByCode[c.code] = found.id;
      console.log(`Cours deja existant : ${c.code}`);
      continue;
    }
    const created = await CourseRepository.create(c.code, c.name, c.description);
    courseIdByCode[c.code] = created.id;
    console.log(`Cours cree : ${c.code} - ${c.name}`);
  }

  console.log("=== Creation des etudiants ===");
  const hash = await hashPassword(STUDENT_PASSWORD);
  for (const s of students) {
    const existing = await UserRepository.findByEmail(s.email);
    if (existing) {
      console.log(`Etudiant deja existant : ${s.email}`);
      continue;
    }
    await UserRepository.createStudent(s.name, s.email, hash);
    console.log(`Etudiant cree : ${s.name} <${s.email}> / mot de passe = ${STUDENT_PASSWORD}`);
  }

  console.log("=== Creation des examens et questions ===");
  const now = new Date();
  const startAt = new Date(now.getTime() - 60 * 60 * 1000);
  const endAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  for (const e of examsData) {
    const courseId = courseIdByCode[e.courseCode];
    const examResult = await pool.query(
      `INSERT INTO exams (course_id, title, description, start_at, end_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [courseId, e.title, e.description, startAt, endAt]
    );
    const examId = examResult.rows[0].id;
    console.log(`Examen cree : ${e.title} (cours ${e.courseCode})`);

    for (const q of e.questions) {
      const questionResult = await pool.query(
        `INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING id`,
        [examId, q.statement, q.points]
      );
      const questionId = questionResult.rows[0].id;
      for (const c of q.choices) {
        await pool.query(
          `INSERT INTO choices (question_id, text, is_correct) VALUES ($1, $2, $3)`,
          [questionId, c.text, c.is_correct]
        );
      }
      console.log(`  Question ajoutee : ${q.statement}`);
    }
  }

  console.log("=== Termine ===");
  await pool.end();
};

seedDemo().catch((err) => {
  console.error(err);
  process.exit(1);
});