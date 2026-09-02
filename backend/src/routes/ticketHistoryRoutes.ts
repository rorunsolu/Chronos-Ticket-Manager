import express from "express";
import { requireAuth } from "../middleware/authMw";
import {
  getTicketHistory,
  createTicketHistory,
} from "../controllers/ticketHistoryController";

const router = express.Router();

router.get("/:ticketId/history", requireAuth, getTicketHistory);
router.post("/:ticketId/history", requireAuth, createTicketHistory);

export default router;
