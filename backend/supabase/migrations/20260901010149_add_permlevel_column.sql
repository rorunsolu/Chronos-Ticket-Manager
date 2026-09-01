ALTER TABLE public.users
ADD COLUMN perm_level perm_level NOT NULL DEFAULT 'user';