-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     name TEXT NOT NULL,
--     email TEXT UNIQUE NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE TABLE tickets (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER NOT NULL REFERENCES users(id),
--   subject TEXT NOT NULL,
--   description TEXT NOT NULL,
--   status TEXT NOT NULL DEFAULT 'open',
--   priority TEXT NOT NULL DEFAULT 'medium',
--   assigned_to INTEGER REFERENCES users(id),
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW(),
--   CONSTRAINT valid_status CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
--   CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
-- );
-- ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'customer' 
-- CHECK (role IN ('customer', 'agent', 'admin'));
-- CREATE TABLE ticket_comments (
--   id SERIAL PRIMARY KEY,
--   ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
--   user_id INTEGER NOT NULL REFERENCES users(id),
--   message TEXT NOT NULL,
--   created_at TIMESTAMP DEFAULT NOW()
-- );
-- ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
-- ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- select using (auth.uid() = id); both of these lines were cuaisng issues when i try to run the migration
-- update using (auth.uid() = id);
create or replace function public.handle_new_user() returns trigger as $$ begin
insert into public.users (id, email, name)
values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name'
  );
return new;
end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after
insert on auth.users for each row execute function public.handle_new_user();
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  status text not null default 'open' check (
    status in ('open', 'in_progress', 'resolved', 'closed')
  ),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.ticket_comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);