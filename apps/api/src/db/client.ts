import "./../load-env.ts";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.ts";

const connectionString = process.env.DATABASE_URL ?? "postgres://meridian:meridian@localhost:5432/meridian";

export const sqlClient = postgres(connectionString, { max: 10 });
export const db = drizzle(sqlClient, { schema });
