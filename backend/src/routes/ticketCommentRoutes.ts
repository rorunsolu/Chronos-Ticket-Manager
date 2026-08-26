import express from "express";
import {
  createTicketComment,
  getTicketComments,
} from "../controllers/ticketCommentController";
import { requireAuth } from "../middleware/authMw";

const router = express.Router();

router.post("/:ticketId/comments", requireAuth, createTicketComment);
router.get("/:ticketId/comments", requireAuth, getTicketComments);

export default router;
