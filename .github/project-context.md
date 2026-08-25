# Project Context

## Overview

What the application does and who uses it.

## Tech Stack

- React
- TypeScript
- Vite
- Express
- Supabase
- PostgreSQL
- shadcn/ui
- Tailwind CSS

## Architecture

Frontend
→ React components
→ hooks
→ API client
→ Express API
→ services
→ PostgreSQL/Supabase
→ React Query

## Authentication

Supabase handles authentication.
The frontend obtains the user's authentication token.
The backend validates the token and uses the authenticated user's ID.

## Important Conventions

- Business logic belongs in services.
- Controllers handle HTTP concerns.

## Database Migrations

- Database schema changes are managed using the Supabase CLI migration system.
- Do not recommend manually making schema changes directly in the remote/production database.
- Database changes should be represented by version-controlled migration files.
- When a database schema change is required, use the existing Supabase migration workflow.
- Before creating a migration, inspect the existing database schema and migration history.
- Migration SQL should be reviewed before being applied.
- Do not modify an already-applied migration to change historical database state. Create a new migration instead.
- When suggesting database changes, explain any important implications for existing data, foreign keys, indexes, constraints, or application code.
