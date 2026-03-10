import bcrypt from "bcrypt";
import { pool } from "./src/src/db.js";

async function createAdmin() {
  try {
    const hash = await bcrypt.hash("admin123", 10);
    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, phone, role, password_hash)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, full_name, email, role`,
      ["Admin User", "admin@smtei.edu.ph", "+63 999 123 4567", "admin", hash]
    );
    console.log("Admin user created:", rows[0]);
  } catch (err) {
    console.error("Error creating admin:", err.message);
  } finally {
    await pool.end();
  }
}

createAdmin();