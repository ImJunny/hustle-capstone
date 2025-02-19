import { pgSchema, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const app_schema = pgSchema("app");

export const users = app_schema.table("users", {
  uuid: uuid("uuid").primaryKey().notNull().unique(),
  email: text("email"),
  username: varchar("username"),
  first_name: text("first_name"),
  last_name: text("last_name"),
  created_at: timestamp("created_at"),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
});
