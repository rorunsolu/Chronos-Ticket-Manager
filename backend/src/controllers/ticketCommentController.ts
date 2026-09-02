import { Response } from "express";
import { AuthedRequest } from "../middleware/authMw";
import { type TicketComment } from "../services/ticketCommentService";
import * as ticketCommentService from "../services/ticketCommentService";

export async function createComment(req: AuthedRequest, res: Response) {
  try {
    const createdById = req.user?.sub as string;
    const message = req.body.message as string;
    const { ticketId } = req.params as { ticketId: string };

    if (!ticketId) {
      return res
        .status(400)
        .json({ message: "Ticket ID is required to create comment" });
    }

    const data = { message, ticketId };

    const comment = await ticketCommentService.createComment(createdById, data);
    console.log("Comment created:", comment);
    res.status(201).json(comment);
  } catch (error) {
    console.log("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getTicketComments(req: AuthedRequest, res: Response) {
  try {
    const { ticketId } = req.params as { ticketId: string };

    if (!ticketId) {
      return res
        .status(400)
        .json({ message: "Ticket ID is required to get comments" });
    }

    const comments = await ticketCommentService.getCommentsByTicketId(ticketId);

    res.json(comments);
  } catch (error) {
    console.error("Error getting ticket comments:", error);
    res.status(500).json({ message: "Server error" });
  }
}
