import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./db-migrations",
  dialect: "postgresql",
  migrations: {
    prefix: "supabase",
  },
});
