import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  geometry,
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
  username: varchar("username"),
  display_name: text("display_name"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
  date_of_birth: date("date_of_birth"),
  onboarding_phase: text("onboarding_phase").references(
    () => onboarding_phase_types.name
  ),
});

export const posts = app_schema.table("posts", {
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
  type: text("type", { enum: ["work", "hire"] }).notNull(),
  location_type: text("location_type")
    .references(() => location_types.name)
    .notNull(),
  location_address: text("location_address"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  due_date: date("due_date"),
  status_type: text("status_type").references(() => status_types.name, {
    onDelete: "set null",
  }),
});
export const accepted_jobs = app_schema.table("accepted_jobs", {
  id: serial("id").primaryKey(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid, {
      onDelete: "cascade",
    })
    .notNull(),
  job_uuid: uuid("job_uuid")
    .references(() => posts.uuid, {
      onDelete: "cascade",
    })
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
  post_uuid: uuid("post_uuid").references(() => posts.uuid, {
    onDelete: "cascade",
  }),
});

export const initiated_jobs = app_schema.table("initiated_jobs", {
  id: serial("id").primaryKey(),
  worker_uuid: uuid("worker_uuid")
    .references(() => users.uuid)
    .notNull(),
  job_post_uuid: uuid("job_post_uuid")
    .references(() => posts.uuid)
    .notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  progress_type: text("progress_type").references(() => progress_types.name),
});

export const post_images = app_schema.table("post_images", {
  id: serial("id").primaryKey(),
  image_url: text("image_url").notNull(),
  post_uuid: uuid("post_uuid").references(() => posts.uuid, {
    onDelete: "cascade",
  }),
});

export const reviews = app_schema.table("reviews", {
  id: serial("id").primaryKey(),
  type: text("type", { enum: ["work", "hire"] }).notNull(),
  reviewer_uuid: uuid("reviewer_uuid").references(() => users.uuid),
  reviewee_uuid: uuid("reviewee_uuid").references(() => users.uuid),
  job_post_uuid: uuid("job_uuid").references(() => posts.uuid, {
    onDelete: "cascade",
  }),
  service_post_uuid: uuid("service_uuid").references(() => posts.uuid, {
    onDelete: "cascade",
  }),
});

export const transactions = app_schema.table("transactions", {
  id: serial("id").primaryKey(),
  user_uuid: uuid("user_uuid").references(() => users.uuid),
  post_uuid: uuid("post_uuid").references(() => posts.uuid),
});

export const addresses = app_schema.table("addresses", {
  id: serial("id").primaryKey(),
  user_uuid: uuid("user_uuid").references(() => users.uuid),
  title: text("title"),
  address_line_1: text("address_line_1"),
  address_line_2: text("address_line_2"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zip_code: text("zip_code"),
  location: geometry("location", {
    type: "point",
    mode: "xy",
    srid: 4326,
  }).notNull(),
  visible: boolean("visible").default(true),
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
