import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { CreateResearcherSchema, UpdateResearcherSchema, UpdateResearchPaperSchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Get all researchers with optional search
app.get("/api/researchers", async (c) => {
  const search = c.req.query("search") || "";
  
  let sql = "SELECT * FROM researchers";
  let params: any[] = [];
  
  if (search) {
    sql += " WHERE full_name LIKE ? OR student_id LIKE ? OR phone_number LIKE ? OR email LIKE ?";
    const searchParam = `%${search}%`;
    params = [searchParam, searchParam, searchParam, searchParam];
  }
  
  sql += " ORDER BY created_at DESC";
  
  try {
    const { results } = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json(results);
  } catch (error) {
    return c.json({ error: "Failed to fetch researchers" }, 500);
  }
});

// Get researcher by ID
app.get("/api/researchers/:id", async (c) => {
  const id = c.req.param("id");
  
  try {
    const result = await c.env.DB.prepare("SELECT * FROM researchers WHERE id = ?").bind(id).first();
    
    if (!result) {
      return c.json({ error: "Researcher not found" }, 404);
    }
    
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to fetch researcher" }, 500);
  }
});

// Create researcher
app.post("/api/researchers", zValidator("json", CreateResearcherSchema), async (c) => {
  const data = c.req.valid("json");
  
  try {
    const result = await c.env.DB.prepare(
      "INSERT INTO researchers (full_name, student_id, phone_number, email, research_papers_count) VALUES (?, ?, ?, ?, ?)"
    ).bind(data.full_name, data.student_id, data.phone_number, data.email || null, data.research_papers_count).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to create researcher" }, 500);
    }
    
    const newResearcher = await c.env.DB.prepare("SELECT * FROM researchers WHERE id = ?").bind(result.meta.last_row_id).first();
    
    return c.json(newResearcher, 201);
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "Student ID already exists" }, 409);
    }
    return c.json({ error: "Failed to create researcher" }, 500);
  }
});

// Update researcher
app.put("/api/researchers/:id", zValidator("json", UpdateResearcherSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  try {
    // Check if researcher exists
    const existing = await c.env.DB.prepare("SELECT * FROM researchers WHERE id = ?").bind(id).first();
    if (!existing) {
      return c.json({ error: "Researcher not found" }, 404);
    }
    
    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const params: any[] = [];
    
    if (data.full_name !== undefined) {
      updates.push("full_name = ?");
      params.push(data.full_name);
    }
    if (data.student_id !== undefined) {
      updates.push("student_id = ?");
      params.push(data.student_id);
    }
    if (data.phone_number !== undefined) {
      updates.push("phone_number = ?");
      params.push(data.phone_number);
    }
    if (data.email !== undefined) {
      updates.push("email = ?");
      params.push(data.email || null);
    }
    if (data.research_papers_count !== undefined) {
      updates.push("research_papers_count = ?");
      params.push(data.research_papers_count);
    }
    
    if (updates.length === 0) {
      return c.json({ error: "No fields to update" }, 400);
    }
    
    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);
    
    const sql = `UPDATE researchers SET ${updates.join(", ")} WHERE id = ?`;
    const result = await c.env.DB.prepare(sql).bind(...params).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to update researcher" }, 500);
    }
    
    const updatedResearcher = await c.env.DB.prepare("SELECT * FROM researchers WHERE id = ?").bind(id).first();
    return c.json(updatedResearcher);
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "Student ID already exists" }, 409);
    }
    return c.json({ error: "Failed to update researcher" }, 500);
  }
});

// Delete researcher
app.delete("/api/researchers/:id", async (c) => {
  const id = c.req.param("id");
  
  try {
    const result = await c.env.DB.prepare("DELETE FROM researchers WHERE id = ?").bind(id).run();
    
    if (!result.success) {
      return c.json({ error: "Researcher not found" }, 404);
    }
    
    return c.json({ message: "Researcher deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete researcher" }, 500);
  }
});

// Get all research topics
app.get("/api/topics", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM research_topics ORDER BY name").all();
    return c.json(results);
  } catch (error) {
    return c.json({ error: "Failed to fetch topics" }, 500);
  }
});

// Get research papers with topic and researcher info
app.get("/api/papers", async (c) => {
  const topic_id = c.req.query("topic_id");
  const researcher_id = c.req.query("researcher_id");
  
  let sql = `
    SELECT p.*, t.name as topic_name, r.full_name as researcher_name 
    FROM research_papers p 
    JOIN research_topics t ON p.topic_id = t.id 
    JOIN researchers r ON p.researcher_id = r.id
  `;
  let params: any[] = [];
  
  const conditions = [];
  if (topic_id) {
    conditions.push("p.topic_id = ?");
    params.push(topic_id);
  }
  if (researcher_id) {
    conditions.push("p.researcher_id = ?");
    params.push(researcher_id);
  }
  
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  
  sql += " ORDER BY p.created_at DESC";
  
  try {
    const { results } = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json(results);
  } catch (error) {
    return c.json({ error: "Failed to fetch papers" }, 500);
  }
});

// Get research statistics by topic
app.get("/api/statistics/topics", async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        t.id,
        t.name,
        t.description,
        COUNT(p.id) as paper_count,
        COUNT(DISTINCT p.researcher_id) as researcher_count
      FROM research_topics t
      LEFT JOIN research_papers p ON t.id = p.topic_id
      GROUP BY t.id, t.name, t.description
      ORDER BY paper_count DESC, t.name
    `).all();
    return c.json(results);
  } catch (error) {
    return c.json({ error: "Failed to fetch topic statistics" }, 500);
  }
});

// Download file endpoint
app.get("/api/files/:key{.+}", async (c) => {
  const key = c.req.param("key");
  
  try {
    const object = await c.env.R2_BUCKET.get(key);
    
    if (!object) {
      return c.json({ error: "File not found" }, 404);
    }
    
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    
    return c.body(object.body, { headers });
  } catch (error) {
    console.error("Error downloading file:", error);
    return c.json({ error: "Failed to download file" }, 500);
  }
});

// Create research paper with file upload
app.post("/api/papers", async (c) => {
  try {
    const formData = await c.req.formData();
    
    const title = formData.get("title") as string;
    const researcher_id = parseInt(formData.get("researcher_id") as string);
    const topic_id = parseInt(formData.get("topic_id") as string);
    const publication_year = formData.get("publication_year") ? parseInt(formData.get("publication_year") as string) : null;
    const journal_name = (formData.get("journal_name") as string) || null;
    const abstract = (formData.get("abstract") as string) || null;
    const file = formData.get("file") as File | null;
    
    // Validate required fields
    if (!title || !researcher_id || !topic_id) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    let fileUrl = null;
    let fileName = null;
    let fileSize = null;
    
    // Handle file upload if provided
    if (file && file.size > 0) {
      try {
        // Create unique filename with timestamp
        const timestamp = Date.now();
        const fileKey = `papers/${researcher_id}/${timestamp}_${file.name}`;
        
        // Upload to R2
        const uploadResult = await c.env.R2_BUCKET.put(fileKey, file.stream(), {
          httpMetadata: {
            contentType: file.type,
            contentDisposition: `attachment; filename="${file.name}"`,
          },
        });
        
        if (uploadResult) {
          fileUrl = `/api/files/${fileKey}`;
          fileName = file.name;
          fileSize = file.size;
        }
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        return c.json({ error: "Failed to upload file" }, 500);
      }
    }
    
    // Insert paper into database
    const result = await c.env.DB.prepare(
      "INSERT INTO research_papers (title, researcher_id, topic_id, publication_year, journal_name, abstract, file_url, file_name, file_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(title, researcher_id, topic_id, publication_year, journal_name, abstract, fileUrl, fileName, fileSize).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to create research paper" }, 500);
    }
    
    // Update researcher's paper count
    await c.env.DB.prepare(`
      UPDATE researchers 
      SET research_papers_count = (
        SELECT COUNT(*) FROM research_papers WHERE researcher_id = ?
      )
      WHERE id = ?
    `).bind(researcher_id, researcher_id).run();
    
    const newPaper = await c.env.DB.prepare(`
      SELECT p.*, t.name as topic_name, r.full_name as researcher_name 
      FROM research_papers p 
      JOIN research_topics t ON p.topic_id = t.id 
      JOIN researchers r ON p.researcher_id = r.id 
      WHERE p.id = ?
    `).bind(result.meta.last_row_id).first();
    
    return c.json(newPaper, 201);
  } catch (error) {
    console.error("Error creating paper:", error);
    return c.json({ error: "Failed to create research paper" }, 500);
  }
});

// Update research paper
app.put("/api/papers/:id", zValidator("json", UpdateResearchPaperSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  try {
    const existing = await c.env.DB.prepare("SELECT * FROM research_papers WHERE id = ?").bind(id).first();
    if (!existing) {
      return c.json({ error: "Research paper not found" }, 404);
    }
    
    const updates: string[] = [];
    const params: any[] = [];
    
    if (data.title !== undefined) {
      updates.push("title = ?");
      params.push(data.title);
    }
    if (data.researcher_id !== undefined) {
      updates.push("researcher_id = ?");
      params.push(data.researcher_id);
    }
    if (data.topic_id !== undefined) {
      updates.push("topic_id = ?");
      params.push(data.topic_id);
    }
    if (data.publication_year !== undefined) {
      updates.push("publication_year = ?");
      params.push(data.publication_year || null);
    }
    if (data.journal_name !== undefined) {
      updates.push("journal_name = ?");
      params.push(data.journal_name || null);
    }
    if (data.abstract !== undefined) {
      updates.push("abstract = ?");
      params.push(data.abstract || null);
    }
    
    if (updates.length === 0) {
      return c.json({ error: "No fields to update" }, 400);
    }
    
    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);
    
    const sql = `UPDATE research_papers SET ${updates.join(", ")} WHERE id = ?`;
    const result = await c.env.DB.prepare(sql).bind(...params).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to update research paper" }, 500);
    }
    
    // Update researcher paper counts if researcher changed
    if (data.researcher_id !== undefined) {
      const oldResearcherId = (existing as any).researcher_id;
      
      // Update old researcher's count
      await c.env.DB.prepare(`
        UPDATE researchers 
        SET research_papers_count = (
          SELECT COUNT(*) FROM research_papers WHERE researcher_id = ?
        )
        WHERE id = ?
      `).bind(oldResearcherId, oldResearcherId).run();
      
      // Update new researcher's count
      await c.env.DB.prepare(`
        UPDATE researchers 
        SET research_papers_count = (
          SELECT COUNT(*) FROM research_papers WHERE researcher_id = ?
        )
        WHERE id = ?
      `).bind(data.researcher_id, data.researcher_id).run();
    }
    
    const updatedPaper = await c.env.DB.prepare(`
      SELECT p.*, t.name as topic_name, r.full_name as researcher_name 
      FROM research_papers p 
      JOIN research_topics t ON p.topic_id = t.id 
      JOIN researchers r ON p.researcher_id = r.id 
      WHERE p.id = ?
    `).bind(id).first();
    
    return c.json(updatedPaper);
  } catch (error) {
    return c.json({ error: "Failed to update research paper" }, 500);
  }
});

// Delete research paper
app.delete("/api/papers/:id", async (c) => {
  const id = c.req.param("id");
  
  try {
    const existing = await c.env.DB.prepare("SELECT researcher_id, file_url FROM research_papers WHERE id = ?").bind(id).first();
    if (!existing) {
      return c.json({ error: "Research paper not found" }, 404);
    }
    
    // Delete the file from R2 if it exists
    const fileUrl = (existing as any).file_url;
    if (fileUrl) {
      try {
        const fileKey = fileUrl.replace("/api/files/", "");
        await c.env.R2_BUCKET.delete(fileKey);
      } catch (deleteError) {
        console.error("Error deleting file from R2:", deleteError);
        // Continue with paper deletion even if file deletion fails
      }
    }
    
    const result = await c.env.DB.prepare("DELETE FROM research_papers WHERE id = ?").bind(id).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to delete research paper" }, 500);
    }
    
    // Update researcher's paper count
    const researcherId = (existing as any).researcher_id;
    await c.env.DB.prepare(`
      UPDATE researchers 
      SET research_papers_count = (
        SELECT COUNT(*) FROM research_papers WHERE researcher_id = ?
      )
      WHERE id = ?
    `).bind(researcherId, researcherId).run();
    
    return c.json({ message: "Research paper deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete research paper" }, 500);
  }
});

export default app;
