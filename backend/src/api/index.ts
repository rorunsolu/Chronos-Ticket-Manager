import express from "express";
import { supabasePool } from "../db";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/test-db", async (req, res) => {
  try {
    const result = await supabasePool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello mate");
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
