// src/routes/public.js
import { Router } from "express";
import { pool } from "../src/db.js";

export const publicRouter = Router();

publicRouter.get("/programs", async (req, res, next) => {
  try {
    const { type, q } = req.query;

    const params = [];
    let where = `WHERE p.is_published = true`;

    if (type) {
      params.push(type);
      where += ` AND p.program_type = $${params.length}`;
    }
    if (q) {
      params.push(`%${q}%`);
      where += ` AND p.name ILIKE $${params.length}`;
    }

    const sql = `
      SELECT p.id, p.name, p.program_type, p.duration_text,
             c.id AS category_id, c.name AS category_name
      FROM programs p
      LEFT JOIN program_categories c ON c.id = p.category_id
      // ${where}
      ORDER BY p.name ASC
      LIMIT 200;
    `;

    const { rows } = await pool.query(sql, params);

    res.json({
      items: rows.map(r => ({
        id: r.id,
        name: r.name,
        program_type: r.program_type,
        duration_text: r.duration_text,
        category: r.category_id ? { id: r.category_id, name: r.category_name } : null
      }))
    });
  } catch (err) {
    next(err);
  }
});