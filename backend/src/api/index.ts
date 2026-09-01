import express from "express";
import { supabasePool } from "../db";
import profileRoutes from "../routes/profileRoutes";
import ticketRoutes from "../routes/ticketRoutes";
import protectedRoutes from "../routes/protected";
import ticketCommentRoutes from "../routes/ticketCommentRoutes";
import ticketHistoryRoutes from "../routes/ticketHistoryRoutes";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello mate");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await supabasePool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

app.use("/api/profile", profileRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", ticketCommentRoutes);
app.use("/api/tickets", ticketHistoryRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
