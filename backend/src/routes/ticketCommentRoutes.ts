import express from "express";
import { createTicketComment } from "../controllers/ticketCommentController";
import { requireAuth } from "../middleware/authMw";

const router = express.Router();

router.post("/:ticketId/comments", requireAuth, createTicketComment);

export default router;
