
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'student')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);


CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_at TIMESTAMP NOT NULL,
  end_at TIMESTAMP NOT NULL,
  CHECK (end_at > start_at)
);


CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  statement TEXT NOT NULL,
  points NUMERIC(6,2) NOT NULL CHECK (points > 0)
);


CREATE TABLE choices (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE attempts (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE RESTRICT,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  submitted_at TIMESTAMP NOT NULL DEFAULT now(),
  score NUMERIC(6,2) NOT NULL DEFAULT 0,
  UNIQUE (exam_id, student_id)
);


CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  choice_id INTEGER REFERENCES choices(id) ON DELETE RESTRICT,
  UNIQUE (attempt_id, question_id)
);

CREATE INDEX idx_exams_course ON exams(course_id);
CREATE INDEX idx_questions_exam ON questions(exam_id);
CREATE INDEX idx_choices_question ON choices(question_id);
CREATE INDEX idx_attempts_exam ON attempts(exam_id);
CREATE INDEX idx_attempts_student ON attempts(student_id);