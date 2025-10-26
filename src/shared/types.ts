import z from "zod";

export const ResearcherSchema = z.object({
  id: z.number(),
  full_name: z.string().min(1, "Full name is required"),
  student_id: z.string().min(1, "Student ID is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Please enter a valid email address").optional(),
  research_papers_count: z.number().int().min(0, "Research papers count must be 0 or greater"),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateResearcherSchema = ResearcherSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateResearcherSchema = CreateResearcherSchema.partial();

export type Researcher = z.infer<typeof ResearcherSchema>;
export type CreateResearcher = z.infer<typeof CreateResearcherSchema>;
export type UpdateResearcher = z.infer<typeof UpdateResearcherSchema>;

export const ResearchTopicSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ResearchPaperSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required"),
  researcher_id: z.number(),
  topic_id: z.number(),
  publication_year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  journal_name: z.string().optional(),
  abstract: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateResearchPaperSchema = ResearchPaperSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateResearchPaperSchema = CreateResearchPaperSchema.partial();

export type ResearchTopic = z.infer<typeof ResearchTopicSchema>;
export type ResearchPaper = z.infer<typeof ResearchPaperSchema>;
export type CreateResearchPaper = z.infer<typeof CreateResearchPaperSchema>;
export type UpdateResearchPaper = z.infer<typeof UpdateResearchPaperSchema>;
