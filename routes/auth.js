// backend/src/routes/auth.js

import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { pool } from "../src/db.js";
import { authMiddleware, requireRole } from "../src/middleware/auth.js";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// JWT_SECRET will be read at request time; ensure .env is loaded in server.js
const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { fullName, email, phone, dob, accountType, password } = req.body;
  console.log('signup attempt', { email, fullName });
  if (!fullName || !email || !password) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, phone, dob, account_type, password_hash)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,full_name,email,role`,
      [fullName, email, phone, dob, accountType, hash]
    );
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ ok: true, user, token });
  } catch (err) {
    // handle unique constraint violation on email
    if (err.code === '23505') {
      console.warn('attempt to register duplicate email', email);
      return res.status(400).json({ ok: false, error: 'Email already registered' });
    }
    console.error('signup error', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

authRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log('signin attempt for', email);
  const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  const user = rows[0];
  if (!user) {
    console.log('user not found');
  } else {
    console.log('user exists, comparing hash');
  }
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    console.log('invalid credentials for', email);
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ ok: true, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }, token });
});

authRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, full_name, email, phone, dob, account_type, profile_picture_url, role, created_at
         FROM users WHERE id = $1`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }
    return res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error('error fetching /me profile', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

// allow the authenticated user to update their profile info
authRouter.put("/me", authMiddleware, async (req, res) => {
  const { fullName, phone, dob } = req.body;
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      `UPDATE users
         SET full_name = $1,
             phone = $2,
             dob = $3
       WHERE id = $4
       RETURNING id, full_name, email, phone, dob, account_type, role, created_at`,
      [fullName, phone, dob, userId]
    );
    res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error('error updating profile', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

// example admin-only endpoint
authRouter.get("/admin/users", authMiddleware, requireRole(["admin"]), async (req, res) => {
  const { rows } = await pool.query(`SELECT id,full_name,email,role,created_at FROM users`);
  res.json({ ok: true, users: rows });
});

// Upload profile picture
authRouter.post("/me/profile-picture", authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file provided' });
    }

    const userId = req.user.id;
    const uploadDir = './public/uploads/profiles';
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Generate filename
    const ext = path.extname(req.file.originalname);
    const filename = `${userId}-${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);
    const url = `/uploads/profiles/${filename}`;
    
    // Write file to disk
    await fs.writeFile(filepath, req.file.buffer);
    
    // Update database
    const { rows } = await pool.query(
      `UPDATE users
         SET profile_picture_url = $1
       WHERE id = $2
       RETURNING id, full_name, email, phone, dob, account_type, profile_picture_url, role, created_at`,
      [url, userId]
    );
    
    res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error('error uploading profile picture', err);
    res.status(500).json({ ok: false, error: 'Failed to upload profile picture' });
  }
});

// Delete profile picture
authRouter.delete("/me/profile-picture", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current profile picture URL
    const { rows: users } = await pool.query(
      `SELECT profile_picture_url FROM users WHERE id = $1`,
      [userId]
    );
    
    if (users.length > 0 && users[0].profile_picture_url) {
      const filename = path.basename(users[0].profile_picture_url);
      const filepath = path.join('./public/uploads/profiles', filename);
      
      // Delete file from disk
      try {
        await fs.unlink(filepath);
      } catch (fileErr) {
        console.warn('failed to delete file', fileErr);
      }
    }
    
    // Update database
    const { rows } = await pool.query(
      `UPDATE users
         SET profile_picture_url = NULL
       WHERE id = $1
       RETURNING id, full_name, email, phone, dob, account_type, profile_picture_url, role, created_at`,
      [userId]
    );
    
    res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error('error deleting profile picture', err);
    res.status(500).json({ ok: false, error: 'Failed to delete profile picture' });
  }
});

// Sync Firebase users to Postgres
authRouter.post("/sync-firebase-users", async (req, res) => {
  try {
    // Note: This endpoint should be called from your Firebase setup or admin CLI
    // It accepts an array of Firebase user objects
    const { users: firebaseUsers } = req.body;
    
    if (!Array.isArray(firebaseUsers)) {
      return res.status(400).json({ ok: false, error: 'Expected users array' });
    }
    
    let synced = 0;
    let skipped = 0;
    
    for (const fbUser of firebaseUsers) {
      try {
        const { rows: existing } = await pool.query(
          `SELECT id FROM users WHERE email = $1`,
          [fbUser.email]
        );
        
        if (existing.length === 0) {
          // User doesn't exist, create placeholder (no password)
          await pool.query(
            `INSERT INTO users (full_name, email, phone, dob, account_type, password_hash, role)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              fbUser.fullName || fbUser.displayName || 'Firebase User',
              fbUser.email,
              fbUser.phone || null,
              fbUser.dateOfBirth || null,
              fbUser.accountType || 'both',
              'firebase-user', // placeholder for Firebase-only users
              'user'
            ]
          );
          synced++;
        } else {
          skipped++;
        }
      } catch (err) {
        console.warn('failed to sync user', fbUser.email, err);
      }
    }
    
    res.json({ ok: true, synced, skipped });
  } catch (err) {
    console.error('error syncing Firebase users', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

export { authRouter };
