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
alter table public.users enable row level security;
drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile" on public.users for
select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users for
update using (auth.uid() = id);
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