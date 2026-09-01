ALTER TABLE tickets
ADD COLUMN first_responded_at TIMESTAMPTZ,
    ADD COLUMN response_due_at TIMESTAMPTZ,
    ADD COLUMN resolution_due_at TIMESTAMPTZ;