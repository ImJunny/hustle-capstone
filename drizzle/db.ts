import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.EXPO_PUBLIC_DATABASE_URL as string;
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);
