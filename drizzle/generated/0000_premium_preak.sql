CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."initiated_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_uuid" uuid NOT NULL,
	"job_post_id" serial NOT NULL,
	"progress_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."job_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"min_rate" numeric NOT NULL,
	"max_rate" numeric,
	"location_type" text NOT NULL,
	"location_address" text,
	"due_date" date NOT NULL,
	"status_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."location_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "location_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."post_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_type" text NOT NULL,
	"job_post_id" serial NOT NULL,
	"service_post_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."progress_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "progress_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."service_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"min_rate" numeric NOT NULL,
	"max_rate" numeric,
	"location_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."status_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "status_types_name_unique" UNIQUE("name")
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"bio" text,
	"avatar_url" text,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_worker_uuid_users_uuid_fk" FOREIGN KEY ("worker_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_job_post_id_job_posts_id_fk" FOREIGN KEY ("job_post_id") REFERENCES "app"."job_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_progress_type_progress_types_name_fk" FOREIGN KEY ("progress_type") REFERENCES "app"."progress_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."job_posts" ADD CONSTRAINT "job_posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."job_posts" ADD CONSTRAINT "job_posts_location_type_location_types_name_fk" FOREIGN KEY ("location_type") REFERENCES "app"."location_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."job_posts" ADD CONSTRAINT "job_posts_status_type_status_types_name_fk" FOREIGN KEY ("status_type") REFERENCES "app"."status_types"("name") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_tags" ADD CONSTRAINT "post_tags_tag_type_tag_types_name_fk" FOREIGN KEY ("tag_type") REFERENCES "app"."tag_types"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_tags" ADD CONSTRAINT "post_tags_job_post_id_job_posts_id_fk" FOREIGN KEY ("job_post_id") REFERENCES "app"."job_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_tags" ADD CONSTRAINT "post_tags_service_post_id_service_posts_id_fk" FOREIGN KEY ("service_post_id") REFERENCES "app"."service_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."service_posts" ADD CONSTRAINT "service_posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."service_posts" ADD CONSTRAINT "service_posts_location_type_location_types_name_fk" FOREIGN KEY ("location_type") REFERENCES "app"."location_types"("name") ON DELETE no action ON UPDATE no action;