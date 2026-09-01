CREATE TYPE ticket_action_history AS ENUM (
    'created',
    'updated',
    'assigned',
    'unassigned',
    'status_changed',
    'priority_changed',
    'commented',
    'closed',
    'reopened'
);
CREATE TABLE public.ticket_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id),
    actor_id UUID NOT NULL REFERENCES public.users(id),
    actor_name TEXT NOT NULL,
    actor_perm_level perm_level NOT NULL,
    action_type ticket_action_history NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_fields jsonb
);