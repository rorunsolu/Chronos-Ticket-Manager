import { supabasePool } from "../db";

export type TicketComment = {
  id: string;
  ticket_id: string;
  created_at: string;
  message: string;
  created_by: string;
};

export async function createComment(
  createdById: string,
  data: { message: string; ticketId: string },
) {
  const { message, ticketId } = data;

  const result = await supabasePool.query(
    `
        INSERT INTO public.ticket_comments (ticket_id, message, created_by)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
    [ticketId, message, createdById],
  );
  return result.rows[0] as TicketComment;
}

export async function getCommentsByTicketId(ticketId: string) {
  // Getting all comments for this specific ticket regardless of who made the comments
  const result = await supabasePool.query(
    `
      SELECT *
      FROM public.ticket_comments
      WHERE ticket_id = $1
      ORDER BY created_at DESC
    `,
    [ticketId],
  );
  return result.rows as TicketComment[];
}
