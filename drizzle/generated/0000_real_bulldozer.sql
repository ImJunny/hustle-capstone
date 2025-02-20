CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TYPE "public"."post_types" AS ENUM('job', 'service');--> statement-breakpoint
CREATE TABLE "app"."initiated_jobs" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"job_post_uuid" uuid,
	"progress_type_id" integer,
	CONSTRAINT "initiated_jobs_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "app"."job_posts" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"user_uuid" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"min_rate" numeric NOT NULL,
	"max_rate" numeric NOT NULL,
	"location_type" integer NOT NULL,
	"location_address" text,
	"due_date" date NOT NULL,
	"status_type_id" integer,
	CONSTRAINT "job_posts_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "app"."location_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "location_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."post_tags" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"tag_type_id" integer NOT NULL,
	"post_uuid" uuid NOT NULL,
	CONSTRAINT "post_tags_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "app"."posts" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"typeEnum" "post_types" NOT NULL,
	CONSTRAINT "posts_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "app"."progress_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."service_posts" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"user_uuid" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"min_rate" numeric NOT NULL,
	"max_rate" numeric NOT NULL,
	"location_type" text NOT NULL,
	CONSTRAINT "service_posts_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "app"."status_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."tag_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tag_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."users" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" varchar NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"bio" text,
	"avatar_url" text,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_job_post_uuid_job_posts_uuid_fk" FOREIGN KEY ("job_post_uuid") REFERENCES "app"."job_posts"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_progress_type_id_progress_types_id_fk" FOREIGN KEY ("progress_type_id") REFERENCES "app"."progress_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."job_posts" ADD CONSTRAINT "job_posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."job_posts" ADD CONSTRAINT "job_posts_location_type_location_types_id_fk" FOREIGN KEY ("location_type") REFERENCES "app"."location_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."job_posts" ADD CONSTRAINT "job_posts_status_type_id_status_types_id_fk" FOREIGN KEY ("status_type_id") REFERENCES "app"."status_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_tags" ADD CONSTRAINT "post_tags_tag_type_id_tag_types_id_fk" FOREIGN KEY ("tag_type_id") REFERENCES "app"."tag_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_tags" ADD CONSTRAINT "post_tags_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."service_posts" ADD CONSTRAINT "service_posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE cascade ON UPDATE no action;