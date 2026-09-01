import { Response } from "express";
import { AuthedRequest } from "../middleware/authMw";
import * as ticketService from "../services/ticketService";

export async function getTickets(req: AuthedRequest, res: Response) {
  try {
    const createdById = req.user?.sub as string;
    const tickets = await ticketService.getTicketsForUser(createdById);
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
} // FIXME: This technically only gets tickets for the logged in user not all tickets in general

export async function createTicket(req: AuthedRequest, res: Response) {
  try {
    const createdById = req.user?.sub as string;
    const { title, description, priority } = req.body;
    const ticket = await ticketService.createTicket(createdById, {
      title,
      description,
      priority,
    });
    console.log("Ticket created:", ticket);
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getTicketById(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const createdById = req.user?.sub as string;
    const ticket = await ticketService.getTicketById(id, createdById);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
    console.log("Ticket found by ID:", id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateTicket(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const createdById = req.user?.sub as string;
    const { title, description, status, priority } = req.body;

    const ticket = await ticketService.updateTicket(id, createdById, {
      title,
      description,
      status,
      priority,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
    console.log("Ticket updated with ID:", id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function closeTicket(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const createdById = req.user?.sub as string;
    const permLevel = req.user?.appRole as string;

    const ticket = await ticketService.getTicketById(id, createdById);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (
      !ticketService.canCLoseTicket(ticket, {
        sub: createdById,
        appRole: permLevel,
      })
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to close this ticket" });
    }

    // FIXME: Closing a ticket only works when I change another field at the same time

    const updated = await ticketService.setStatus(id, "closed");
    console.log("Ticket closed with ID:", id);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
