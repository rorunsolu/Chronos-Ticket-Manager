import { supabasePool } from "../db";

export type Ticket = {
  id: string;
  title: string;
  description: string;

  status: TicketStatus;
  priority: TicketPriority;

  assigned_to: string | null;

  created_by: string;
  created_at: string;
  updated_at: string;

  sla_policy_id: string | null;

  first_responded_at: string | null;
  response_due_at: string | null;
  resolution_due_at: string | null;
};

export type TicketStatus =
  | "open"
  | "in_progress"
  | "pending"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

// TODO: Unified type file across backlend and frontend?
// TODO: Check the default priotiry stuff and see if it makes sense across both FE and BE

export async function getTicketsForUser(createdById: string) {
  const result = await supabasePool.query(
    ` SELECT * FROM public.tickets WHERE created_by = $1 ORDER BY created_at DESC `,
    [createdById],
  );
  return result.rows;
}

// User can either choose a priority or leave it blank and the default will be medium
// The data needed from the user is still limited to title, description and the priority if they choose to set one

export async function createTicket(
  createdById: string,
  data: { title: string; description: string; priority?: TicketPriority },
) {
  const priority = data.priority || "medium";
  const result = await supabasePool.query(
    `
      INSERT INTO public.tickets (
        created_by,
        title,
        description,
        priority,
        sla_policy_id,
        response_due_at,
        resolution_due_at
      )
      SELECT
        $1,
        $2,
        $3,
        $4::ticket_priority,
        sla.id,
        NOW() + (sla.first_response_minutes * INTERVAL '1 minute'),
        NOW() + (sla.resolution_minutes * INTERVAL '1 minute')
      FROM public.sla_policies sla
      WHERE sla.priority = $4::ticket_priority 
      RETURNING *
    `,
    [createdById, data.title, data.description, priority],
  );
  return result.rows[0];
}

export async function getTicketById(id: string, createdById: string) {
  const result = await supabasePool.query(
    `
      select *
      from public.tickets
      where id = $1 and created_by = $2
    `,
    [id, createdById],
  );
  return result.rows[0];
} // FIXME: This technically only gets tickets for the logged in user not all tickets in general

export async function updateTicket(
  id: string,
  createdById: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
  },
) {
  const result = await supabasePool.query(
    `
      update public.tickets
      set
        title = coalesce($1, title),
        description = coalesce($2, description),
        status = coalesce($3, status),
        priority = coalesce($4, priority),
        updated_at = now()
      where id = $5 and created_by = $6
      returning *
    `,
    [data.title, data.description, data.status, data.priority, id, createdById],
  );
  return result.rows[0];
}

export async function setStatus(id: string, status: string) {
  const result = await supabasePool.query(
    `
      update public.tickets
      set status = $1, updated_at = now()
      where id = $2
      returning *
    `,
    [status, id],
  );
  return result.rows[0];
}

export function canCLoseTicket(
  ticket: Ticket,
  user: { sub: string; appRole: string },
) {
  return (
    user.appRole === "admin" ||
    user.appRole === "agent" ||
    user.sub === ticket.created_by // this needn't be changed since the only "end-user" that can close a tiocket is the end-user that owns/created it
  );
}
