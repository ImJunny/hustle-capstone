import "dotenv/config";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.EXPO_PUBLIC_DATABASE_URL as string;
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
export type Database = NodePgDatabase<typeof schema>;
