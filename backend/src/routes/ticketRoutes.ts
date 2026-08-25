import express from "express";
import {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
} from "../controllers/ticketController";
import { requireAuth } from "../middleware/authMw";

const router = express.Router();

router.get("/", requireAuth, getTickets);
router.post("/", requireAuth, createTicket);
router.get("/:id", requireAuth, getTicketById);
router.patch("/:id", requireAuth, updateTicket);

export default router;
