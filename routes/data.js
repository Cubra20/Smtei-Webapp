// src/routes/data.js
import { Router } from "express";
import { pool } from "../src/db.js";
import { authMiddleware, requireRole } from "../src/middleware/auth.js";

export const dataRouter = Router();

// submit an inquiry (user must be logged in to attach to a user, otherwise leave user_id null)
dataRouter.post("/inquiry", authMiddleware, async (req, res) => {
  const { companyName, contactPerson, email, phone, message } = req.body;
  const userId = req.user?.id || null;
  const { rows } = await pool.query(
    `INSERT INTO inquiries (user_id, company_name, contact_person, email, phone, message)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [userId, companyName, contactPerson, email, phone, message]
  );
  res.json({ ok: true, inquiry: rows[0] });
});

// submit an application record
dataRouter.post("/application", authMiddleware, async (req, res) => {
  const { completeName, email, phone, qualification, cocTitle, files } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO applications (user_id, complete_name, email, phone, qualification, coc_title, files)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [req.user.id, completeName, email, phone, qualification, cocTitle, files || {}]
  );
  res.json({ ok: true, application: rows[0] });
});

// get own applications
dataRouter.get("/applications", authMiddleware, async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM applications WHERE user_id=$1`, [req.user.id]);
  res.json({ ok: true, applications: rows });
});

// admin endpoints
dataRouter.get("/admin/applications", authMiddleware, requireRole(["admin"]), async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM applications ORDER BY created_at DESC`);
  res.json({ ok: true, applications: rows });
});

dataRouter.patch("/admin/applications/:id/status", authMiddleware, requireRole(["admin"]), async (req, res) => {
  const { status } = req.body;
  const { rows } = await pool.query(
    `UPDATE applications SET status=$1,updated_at=now() WHERE id=$2 RETURNING *`,
    [status, req.params.id]
  );
  res.json({ ok: true, application: rows[0] });
});
