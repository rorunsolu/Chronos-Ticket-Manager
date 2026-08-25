import { Response } from "express";
import { supabasePool } from "../db";
import { AuthedRequest } from "../middleware/authMw";

export async function getTickets(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.sub;

    const result = await supabasePool.query(
      `
        select *
        from public.tickets
        where user_id = $1
        order by created_at desc
      `,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function createTicket(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.sub;
    const { title, description, priority } = req.body;

    const result = await supabasePool.query(
      `
        insert into public.tickets (user_id, title, description, priority)
        values ($1, $2, $3, $4)
        returning *
      `,
      [userId, title, description, priority || "medium"],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getTicketById(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.sub;

    const result = await supabasePool.query(
      `
        select *
        from public.tickets
        where id = $1 and user_id = $2
      `,
      [id, userId],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateTicket(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.sub;
    const { title, description, status, priority } = req.body;

    const result = await supabasePool.query(
      `
        update public.tickets
        set
          title = coalesce($1, title),
          description = coalesce($2, description),
          status = coalesce($3, status),
          priority = coalesce($4, priority),
          updated_at = now()
        where id = $5 and user_id = $6
        returning *
      `,
      [title, description, status, priority, id, userId],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
