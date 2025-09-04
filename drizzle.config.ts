import type { Config } from "drizzle-kit";
import { config } from "dotenv";

// Load .env.local file
config({ path: ".env.local" });

// Debug logging
console.log(
  "🔍 Debug: process.env.DATABASE_URL exists:",
  !!process.env.DATABASE_URL,
);
console.log("🔍 Debug: NODE_ENV:", process.env.NODE_ENV);

// Try to load env directly first
const databaseUrl = process.env.DATABASE_URL;
console.log("process.env:", process.env);
if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not defined in environment variables");
  console.log(
    "Available env vars:",
    Object.keys(process.env).filter((key) => key.includes("DATABASE")),
  );
  process.exit(1);
}

console.log("✅ DATABASE_URL found, length:", databaseUrl.length);

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config;
