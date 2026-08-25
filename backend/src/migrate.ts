import fs from "fs";
import { supabasePool } from "./db";

async function migrate() {
  const sql = fs.readFileSync("src/schema.sql", "utf-8");
  await supabasePool.query(sql);
  console.log("Schema applied");
  await supabasePool.end();
}

migrate();
