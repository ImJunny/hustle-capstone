import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db";

import {
  location_types,
  message_types,
  onboarding_phase_types,
  post_report_reasons,
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
  messageTypes,
  reportReasons,
} from "./db-types";

export async function runMigrations() {
  try {
    console.log("running migrations...");
    await migrate(db, { migrationsFolder: "drizzle/generated" });
    for (const type of tagTypes)
      await db
        .insert(tag_types)
        .values({ name: type.value })
        .onConflictDoNothing();
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
    for (const type of messageTypes)
      await db
        .insert(message_types)
        .values({ name: type })
        .onConflictDoNothing();
    for (const key of Object.keys(reportReasons)) {
      await db
        .insert(post_report_reasons)
        .values({ name: key })
        .onConflictDoNothing();
    }

    console.log("migrations successful");
    return;
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
}

runMigrations();
