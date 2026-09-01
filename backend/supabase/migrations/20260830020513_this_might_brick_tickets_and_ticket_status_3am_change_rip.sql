ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_status_check;
ALTER TABLE public.tickets
ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.tickets
ALTER COLUMN status TYPE public.ticket_status USING status::public.ticket_status;
ALTER TABLE public.tickets
ALTER COLUMN status
SET DEFAULT 'open';