import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Load .env.local file if not already loaded
if (!process.env.DATABASE_URL) {
  config({ path: ".env.local" });
}

// Create connection
const sql = neon(process.env.DATABASE_URL!);

// Export drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export types
export type Database = typeof db;
