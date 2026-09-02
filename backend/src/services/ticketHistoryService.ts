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

export type TicketHistoryInsert = Omit<
  TicketHistoryEntry,
  "id" | "created_at"
> & {
  changed_fields?: Record<string, unknown> | null;
  // The omitted fields are handled/filled by the DB
  // FIXME:A change of fields isnt required to create a history???? Nah that aint right I need to
  // FIXME: make a new migration to make it NOT NULL
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

export async function createTicketHistoryEntry(
  ticketId: string,
  actor: { id: string; permLevel: string },
  data: {
    actionType: ticketHistoryAction;
    changedFields?: Record<string, unknown> | null;
  },
) {
  const userRes = await supabasePool.query(
    `SELECT name FROM public.users WHERE id = $1`,
    [actor.id],
  );

  const actorName = userRes.rows[0]?.name ?? "Unknown";

  const result = await supabasePool.query(
    `
    INSERT INTO public.ticket_history
    (
      ticket_id,
      actor_id,
      actor_name,
      actor_perm_level,
      action_type,
      changed_fields
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      ticketId,
      actor.id,
      actorName,
      actor.permLevel,
      data.actionType,
      data.changedFields ?? null,
    ],
  );
  return result.rows[0] as TicketHistoryEntry;
}
