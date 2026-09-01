import express from "express";
import { requireAuth } from "../middleware/authMw";
import { getTicketHistory } from "../controllers/ticketHistoryController";

const router = express.Router();

router.get("/:ticketId/history", requireAuth, getTicketHistory);

export default router;
