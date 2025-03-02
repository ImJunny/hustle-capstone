import { sql } from "drizzle-orm";
import {
  date,
  integer,
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
  username: varchar("username"),
  first_name: text("first_name"),
  last_name: text("last_name"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
  date_of_birth: date("date_of_birth"),
  onboarding_phase: text("onboarding_phase").references(
    () => onboarding_phase_types.name
  ),
});

export const job_posts = app_schema.table("job_posts", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid, {
      onDelete: "cascade",
    })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  min_rate: integer("min_rate").notNull(),
  max_rate: integer("max_rate"),
  location_type: text("location_type")
    .references(() => location_types.name)
    .notNull(),
  location_address: text("location_address"),
  due_date: date("due_date").notNull(),
  status_type: text("status_type").references(() => status_types.name, {
    onDelete: "set null",
  }),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const service_posts = app_schema.table("service_posts", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid, {
      onDelete: "cascade",
    })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  min_rate: integer("min_rate").notNull(),
  max_rate: integer("max_rate"),
  location_type: text("location_type")
    .references(() => location_types.name)
    .notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const post_tags = app_schema.table("post_tags", {
  id: serial("id").primaryKey(),
  tag_type: text("tag_type")
    .references(() => tag_types.name, {
      onDelete: "cascade",
    })
    .notNull(),
  job_post_uuid: uuid("job_post_uuid").references(() => job_posts.uuid, {
    onDelete: "cascade",
  }),
  service_post_uuid: uuid("service_post_uuid").references(
    () => service_posts.uuid,
    { onDelete: "cascade" }
  ),
});

export const initiated_jobs = app_schema.table("initiated_jobs", {
  id: serial("id").primaryKey(),
  worker_uuid: uuid("worker_uuid")
    .references(() => users.uuid)
    .notNull(),
  job_post_uuid: uuid("job_post_uuid")
    .references(() => job_posts.uuid)
    .notNull(),
  progress_type: text("progress_type")
    .references(() => progress_types.name)
    .notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const post_images = app_schema.table("post_images", {
  id: serial("id").primaryKey(),
  image_url: text("image_url").notNull(),
  job_post_uuid: uuid("job_post_uuid").references(() => job_posts.uuid, {
    onDelete: "cascade",
  }),
  service_post_uuid: uuid("service_post_uuid").references(
    () => service_posts.uuid,
    { onDelete: "cascade" }
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
  name: text("name").unique().notNull(),
});

export const progress_types = app_schema.table("progress_types", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
});

export const onboarding_phase_types = app_schema.table(
  "onboarding_phase_types",
  {
    id: serial("id").primaryKey(),
    name: text("name").unique().notNull(),
  }
);
