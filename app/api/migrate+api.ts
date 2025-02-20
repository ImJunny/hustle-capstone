import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "@/drizzle/db";
import { Database } from "@/server/lib/types";
import {
  location_types,
  progress_types,
  status_types,
  tag_types,
} from "@/drizzle/schema";

export const tagTypes = ["home", "tech", "art", "gaming", "other"];
export const locationTypes = ["remote", "local"];
export const statusTypes = ["open", "initiated", "complete"];
export const progressTypes = ["accepted", "in progress", "complete"];

type Tables = Extract<keyof Database["app"]["Tables"], `${string}_types`>;
export async function insertTypes(table_name: Tables, type: string) {
  await db
    .insert(table_name as any)
    .values({ name: type })
    .onConflictDoNothing();
}

export async function runMigrations() {
  try {
    console.log("running migrations...");
    await migrate(db, { migrationsFolder: "drizzle/generated" });
    for (const type of tagTypes)
      await db.insert(tag_types).values({ name: type }).onConflictDoNothing();
    for (const type of locationTypes)
      await db
        .insert(location_types)
        .values({ name: type })
        .onConflictDoNothing();
    for (const type of statusTypes)
      await db
        .insert(status_types)
        .values({ name: type })
        .onConflictDoNothing();
    for (const type of progressTypes)
      await db
        .insert(progress_types)
        .values({ name: type })
        .onConflictDoNothing();

    console.log("migrations successful");
    return;
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
}

runMigrations();
