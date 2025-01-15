import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export let client = postgres(process.env.DATABASE_URL, { prepare: false });

export let db = drizzle(client, { schema });
