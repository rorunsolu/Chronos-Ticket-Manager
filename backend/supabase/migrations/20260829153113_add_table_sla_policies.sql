CREATE TABLE sla_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    priority ticket_priority NOT NULL UNIQUE,
    first_response_minutes INTEGER NOT NULL,
    resolution_minutes INTEGER NOT NULL
);