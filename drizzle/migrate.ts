import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db";

import {
  location_types,
  onboarding_phase_types,
  progress_types,
  status_types,
  tag_types,
} from "@/drizzle/schema";
import {
  locationTypes,
  onboardingPhaseTypes,
  progressTypes,
  statusTypes,
  tagTypes,
} from "./db-types";

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
    for (const type of onboardingPhaseTypes)
      await db
        .insert(onboarding_phase_types)
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
