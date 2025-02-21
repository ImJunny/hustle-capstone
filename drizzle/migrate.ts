import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "@/drizzle/db";

import {
  location_types,
  progress_types,
  status_types,
  tag_types,
} from "@/drizzle/schema";

export const tagTypes = ["home", "tech", "art", "gaming", "other"] as const;
export const locationTypes = ["remote", "local"] as const;
export const statusTypes = ["open", "initiated", "complete"] as const;
export const progressTypes = ["accepted", "in progress", "complete"] as const;

export async function insertTypes(table_name: any, type: string) {
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
