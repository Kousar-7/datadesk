
CREATE TABLE research_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE research_papers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  researcher_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  publication_year INTEGER,
  journal_name TEXT,
  abstract TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_research_papers_researcher_id ON research_papers(researcher_id);
CREATE INDEX idx_research_papers_topic_id ON research_papers(topic_id);

-- Insert some common research topics
INSERT INTO research_topics (name, description) VALUES 
('Artificial Intelligence', 'Machine learning, neural networks, and AI applications'),
('Computer Science', 'Software engineering, algorithms, and computational theory'),
('Data Science', 'Data analysis, big data, and statistical modeling'),
('Cybersecurity', 'Information security, network security, and cryptography'),
('Software Engineering', 'Software development methodologies and practices'),
('Human-Computer Interaction', 'User experience design and interface studies'),
('Database Systems', 'Database design, management, and optimization'),
('Network Systems', 'Computer networks, distributed systems, and protocols'),
('Mobile Computing', 'Mobile app development and mobile technologies'),
('Web Development', 'Frontend, backend, and full-stack web technologies');
