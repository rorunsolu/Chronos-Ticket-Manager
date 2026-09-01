ALTER TABLE public.tickets
    rename column user_id to created_by;
ALTER TABLE public.ticket_comments
    rename column user_id to created_by;