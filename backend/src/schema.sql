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

ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL