import { Pool } from "pg";
import dotenv from "dotenv";

// https://node-postgres.com/guides/project-structure

dotenv.config();

const pool = new Pool();

export const query = (text: string, params: any[]) => {
  return pool.query(text, params);
};

export const supabasePool = new Pool({
  connectionString: process.env.VITE_SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
