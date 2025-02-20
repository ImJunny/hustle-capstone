import {
  date,
  integer,
  numeric,
  pgEnum,
  pgSchema,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const app_schema = pgSchema("app");

// PRIMARY TABLES
export const users = app_schema.table("users", {
  uuid: uuid("uuid").primaryKey().unique(),
  email: text("email").notNull(),
  username: varchar("username").notNull(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  created_at: timestamp("created_at").notNull(),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
});

export const postTypeEnum = pgEnum("post_types", ["job", "service"]);
export const posts = app_schema.table("posts", {
  uuid: uuid("uuid").primaryKey().unique(),
  typeEnum: pgEnum("post_types", ["job", "service"])().notNull(),
});

export const job_posts = app_schema.table("job_posts", {
  uuid: uuid("uuid").primaryKey().unique(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  min_rate: numeric("min_rate").notNull(),
  max_rate: numeric("max_rate").notNull(),
  location_type_id: integer("location_type")
    .references(() => location_types.id)
    .notNull(),
  location_address: text("location_address"),
  due_date: date("due_date").notNull(),
  status_types_id: integer("status_type_id").references(() => status_types.id, {
    onDelete: "set null",
  }),
});

export const service_posts = app_schema.table("service_posts", {
  uuid: uuid("uuid").primaryKey().unique(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  min_rate: numeric("min_rate").notNull(),
  max_rate: numeric("max_rate").notNull(),
  location_type: text("location_type").notNull(),
});

export const post_tags = app_schema.table("post_tags", {
  uuid: uuid("uuid").primaryKey().unique(),
  tag_type_id: integer("tag_type_id")
    .references(() => tag_types.id, { onDelete: "cascade" })
    .notNull(),
  post_uuid: uuid("post_uuid")
    .references(() => posts.uuid, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const initiated_jobs = app_schema.table("initiated_jobs", {
  uuid: uuid("uuid").primaryKey().unique(),
  job_post_uuid: uuid("job_post_uuid").references(() => job_posts.uuid),
  progress_type_id: integer("progress_type_id").references(
    () => progress_types.id
  ),
});

// TABLES FOR TYPES
export const location_types = app_schema.table("location_types", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
});

export const tag_types = app_schema.table("tag_types", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
});

export const status_types = app_schema.table("status_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const progress_types = app_schema.table("progress_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});
