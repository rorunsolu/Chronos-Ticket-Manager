import { Response } from "express";
import { supabasePool } from "../db";
import { AuthedRequest } from "../middleware/authMw";

export async function createTicketComment(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    const { ticketId } = req.params;
    const { message } = req.body;

    console.log("comment payload:", { ticketId, message, body: req.body });

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const result = await supabasePool.query(
      `
        INSERT INTO public.ticket_comments (ticket_id, user_id, message)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [ticketId, userId, message],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating ticket comment:", error);
    res.status(500).json({
      message: "Server error",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
