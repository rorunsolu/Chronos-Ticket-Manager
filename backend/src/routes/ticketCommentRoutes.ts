import express from "express";
import {
  createComment,
  getTicketComments,
} from "../controllers/ticketCommentController";
import { requireAuth } from "../middleware/authMw";

const router = express.Router();

router.post("/:ticketId/comments", requireAuth, createComment);
router.get("/:ticketId/comments", requireAuth, getTicketComments);

export default router;
