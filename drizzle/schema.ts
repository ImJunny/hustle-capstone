import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  geometry,
  integer,
  numeric,
  pgSchema,
  serial,
  primaryKey,
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
  stripe_customer_id: text("stripe_customer_id"),
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
  address_uuid: uuid("address_uuid").references(() => addresses.uuid, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  due_date: date("due_date"),
  status_type: text("status_type").references(() => status_types.name, {
    onDelete: "set null",
  }),
});

export const post_tags = app_schema.table("post_tags", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
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
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  worker_uuid: uuid("worker_uuid")
    .references(() => users.uuid)
    .notNull(),
  job_post_uuid: uuid("job_post_uuid")
    .references(() => posts.uuid)
    .notNull(),
  linked_service_post_uuid: uuid("linked_service_post_uuid").references(
    () => posts.uuid,
    { onDelete: "set null" }
  ),
  created_at: timestamp("created_at").notNull().defaultNow(),
  progress_type: text("progress_type").references(() => progress_types.name),
  rate: integer("rate").notNull(),
});

export const notifications = app_schema.table("notifications", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_uuid: uuid("user_uuid").references(() => users.uuid),
  post_uuid: uuid("post_uuid"),
  text: text("text").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const post_images = app_schema.table("post_images", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  image_url: text("image_url").notNull(),
  post_uuid: uuid("post_uuid").references(() => posts.uuid, {
    onDelete: "cascade",
  }),
});

export const addresses = app_schema.table("addresses", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),
  title: text("title"),
  address_line_1: text("address_line_1"),
  address_line_2: text("address_line_2"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zip_code: text("zip_code"),
  location: geometry("location", {
    type: "point",
    srid: 4326,
  }).notNull(),
  visible: boolean("visible").default(true),
});

export const messages = app_schema.table("messages", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  sender_uuid: uuid("sender_uuid")
    .references(() => users.uuid)
    .notNull(),
  receiver_uuid: uuid("receiver_uuid")
    .references(() => users.uuid)
    .notNull(),
  message: text("message"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  type: text("type")
    .references(() => message_types.name)
    .default("text"),
  post_uuid: uuid("post_uuid").references(() => posts.uuid),
  is_read: boolean("is_read").default(false),
});

export const disabled_notifications = app_schema.table(
  "disabled_notifications",
  {
    user_uuid: uuid("user_uuid").references(() => users.uuid),
    notification_type: text("notification_type").references(
      () => notification_types.name
    ),
  }
);

export const chats = app_schema.table("chats", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  last_message_uuid: uuid("last_message_uuid")
    .references(() => messages.uuid)
    .notNull(),
});

export const comments = app_schema.table("comments", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  post_uuid: uuid("post_uuid")
    .references(() => posts.uuid, {
      onDelete: "cascade",
    })
    .notNull(),
  user_uuid: uuid("user_uuid").references(() => users.uuid, {
    onDelete: "set null",
  }),
  comment: text("comment"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const job_cancellations = app_schema.table("job_cancellations", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  job_uuid: uuid("job_uuid").references(() => initiated_jobs.uuid, {
    onDelete: "set null",
  }),
  user_uuid: uuid("user_uuid").references(() => users.uuid, {
    onDelete: "set null",
  }),
  type: text("type").notNull(),
  details: text("details"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = app_schema.table("reviews", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  reviewer_uuid: uuid("reviewer_uuid")
    .references(() => users.uuid)
    .notNull(),
  reviewee_uuid: uuid("reviewee_uuid")
    .references(() => users.uuid)
    .notNull(),
  review: text("review"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  reviewer_type: text("reviewer_type", {
    enum: ["worker", "employer"],
  }),
  initiated_job_uuid: uuid("initiated_job_uuid")
    .references(() => initiated_jobs.uuid)
    .notNull(),
  service_uuid: uuid("job_uuid").references(() => posts.uuid),
  rating: integer("rating").notNull(),
});

export const reported_posts = app_schema.table(
  "reported_posts",
  {
    post_uuid: uuid("post_uuid")
      .references(() => posts.uuid)
      .notNull(),
    user_uuid: uuid("user_uuid")
      .references(() => users.uuid)
      .notNull(),
    reason: text("reason").references(() => post_report_reasons.name),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.post_uuid, table.user_uuid] })]
);

export const viewed_posts = app_schema.table(
  "viewed_posts",
  {
    post_uuid: uuid("post_uuid")
      .references(() => posts.uuid)
      .notNull(),
    user_uuid: uuid("user_uuid")
      .references(() => users.uuid)
      .notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.post_uuid, table.user_uuid] })]
);

export const saved_posts = app_schema.table("saved_posts", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),
  post_uuid: uuid("post_uuid")
    .references(() => posts.uuid)
    .notNull(),
});

export const tag_preferences = app_schema.table("tag_preferences", {
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),
  tag_type: text("tag_type")
    .references(() => tag_types.name)
    .notNull(),
  weight: numeric("weight").notNull(),
});

export const payments = app_schema.table("payments", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),
  job_uuid: uuid("job_uuid")
    .references(() => initiated_jobs.uuid, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  amount: numeric("amount").notNull(),
  stripe_payment_intent_id: text("stripe_payment_intent_id"),
  status: text("status", {
    enum: ["pending", "succeeded", "failed", "refunded"],
  }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  type: text("type", {
    enum: ["income", "expense"],
  }).notNull(),
});

export const following = app_schema.table("following", {
  uuid: uuid("uuid")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  follower_uuid: uuid("follower_uuid"),
  followed_uuid: uuid("followed_uuid"),
  created_at: timestamp("created_at").notNull().defaultNow(),
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

export const message_types = app_schema.table("message_types", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
});

export const post_report_reasons = app_schema.table("post_report_reasons", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
});

export const notification_types = app_schema.table("notification_types", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
});
