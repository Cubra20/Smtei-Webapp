import dotenv from "dotenv";

dotenv.config();
console.log('JWT_SECRET env:', process.env.JWT_SECRET ? '[present]' : '[missing]');

import express from "express";
import cors from "cors";
import { pool } from "./src/db.js";
import { publicRouter } from "./routes/public.js";
import { authRouter } from "./routes/auth.js";
import { dataRouter } from "./routes/data.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") ?? "*"
}));
app.use(express.json());

// Serve static files for profile pictures
app.use("/uploads", express.static("./public/uploads"));

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ ok: true, database: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/api/auth", authRouter); // signup / signin / me
app.use("/api", publicRouter);
app.use("/api", dataRouter); // protected endpoints for inquiries/applications

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));