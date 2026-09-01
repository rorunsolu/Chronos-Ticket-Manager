import { Response } from "express";
import { AuthedRequest } from "../middleware/authMw";
import { getTicketHistoryByTicketId } from "../services/ticketHistoryService";

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
