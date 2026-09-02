import { Response } from "express";
import { AuthedRequest } from "../middleware/authMw";
import {
  getTicketHistoryByTicketId,
  createTicketHistoryEntry,
} from "../services/ticketHistoryService";

export async function createTicketHistory(req: AuthedRequest, res: Response) {
  try {
    const { ticketId } = req.params as { ticketId: string };
    const actorId = req.user?.sub as string;
    const actorPermLevel = req.user?.appRole as string;
    const { actionType, changedFields } = req.body;

    if (!ticketId) {
      return res
        .status(400)
        .json({ message: "Ticket ID is required to create history" });
    }

    const historyEntry = await createTicketHistoryEntry(
      ticketId,
      { id: actorId, permLevel: actorPermLevel },
      { actionType, changedFields },
    );

    console.log("History entry created:", historyEntry);
    res.status(201).json(historyEntry);
  } catch (error) {
    console.error("History creation error:", error);
    return res.status(500).json({ message: "Error creating ticket history" });
  }
}

export async function getTicketHistory(req: AuthedRequest, res: Response) {
  try {
    const { ticketId } = req.params as { ticketId: string };

    if (!ticketId) {
      return res
        .status(400)
        .json({ message: "Ticket ID is required to get history" });
    }

    const history = await getTicketHistoryByTicketId(ticketId);

    console.log("Ticket history for ID:", ticketId);
    return res.json(history);
  } catch (error) {
    console.error("Ticket history fetch error:", error);
    return res.status(500).json({ message: "Error fetching ticket history" });
  }
}
