import { supabasePool } from "../db";

export type TicketHistoryEntry = {
  id: string;
  ticket_id: string;
  actor_id: string;
  actor_name: string;
  actor_perm_level: string;
  action_type: ticketHistoryAction;
  created_at: string;
  changed_fields: Record<string, unknown> | null;
};

export type ticketHistoryAction =
  | "created"
  | "updated"
  | "assigned"
  | "unassigned"
  | "status_changed"
  | "priority_changed"
  | "commented"
  | "closed"
  | "reopened";

export async function getTicketHistoryByTicketId(ticketId: string) {
  const result = await supabasePool.query(
    `
      SELECT *
      FROM public.ticket_history
      WHERE ticket_id = $1
      ORDER BY created_at DESC
    `,
    [ticketId],
  );

  return result.rows as TicketHistoryEntry[];
}
