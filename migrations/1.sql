
CREATE TABLE researchers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  student_id TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  research_papers_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_researchers_student_id ON researchers(student_id);
CREATE INDEX idx_researchers_full_name ON researchers(full_name);
