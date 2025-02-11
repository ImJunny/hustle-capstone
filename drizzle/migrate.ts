import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

export async function runMigrations() {
  try {
    console.log("running migrations...");
    await migrate(db, { migrationsFolder: "drizzle/generated" });
    console.log("migrations successful");
    return;
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
}

runMigrations();
