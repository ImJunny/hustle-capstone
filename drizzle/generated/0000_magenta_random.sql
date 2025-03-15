CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."initiated_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_uuid" uuid NOT NULL,
	"job_post_uuid" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"progress_type" text
);
--> statement-breakpoint
CREATE TABLE "app"."location_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "location_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."onboarding_phase_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "onboarding_phase_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."post_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"post_uuid" uuid
);
--> statement-breakpoint
CREATE TABLE "app"."post_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_type" text NOT NULL,
	"post_uuid" uuid
);
--> statement-breakpoint
CREATE TABLE "app"."posts" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"min_rate" integer NOT NULL,
	"max_rate" integer,
	"type" text NOT NULL,
	"location_type" text NOT NULL,
	"location_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"due_date" date,
	"status_type" text
);
--> statement-breakpoint
CREATE TABLE "app"."progress_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "progress_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"reviewer_uuid" uuid,
	"reviewee_uuid" uuid,
	"job_uuid" uuid,
	"service_uuid" uuid
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
CREATE TABLE "app"."transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid,
	"post_uuid" uuid
);
--> statement-breakpoint
CREATE TABLE "app"."users" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" varchar,
	"display_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"bio" text,
	"avatar_url" text,
	"date_of_birth" date,
	"onboarding_phase" text,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_worker_uuid_users_uuid_fk" FOREIGN KEY ("worker_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_job_post_uuid_posts_uuid_fk" FOREIGN KEY ("job_post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_progress_type_progress_types_name_fk" FOREIGN KEY ("progress_type") REFERENCES "app"."progress_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_images" ADD CONSTRAINT "post_images_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_tags" ADD CONSTRAINT "post_tags_tag_type_tag_types_name_fk" FOREIGN KEY ("tag_type") REFERENCES "app"."tag_types"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_tags" ADD CONSTRAINT "post_tags_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."posts" ADD CONSTRAINT "posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."posts" ADD CONSTRAINT "posts_location_type_location_types_name_fk" FOREIGN KEY ("location_type") REFERENCES "app"."location_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."posts" ADD CONSTRAINT "posts_status_type_status_types_name_fk" FOREIGN KEY ("status_type") REFERENCES "app"."status_types"("name") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_reviewer_uuid_users_uuid_fk" FOREIGN KEY ("reviewer_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_reviewee_uuid_users_uuid_fk" FOREIGN KEY ("reviewee_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_job_uuid_posts_uuid_fk" FOREIGN KEY ("job_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_service_uuid_posts_uuid_fk" FOREIGN KEY ("service_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."transactions" ADD CONSTRAINT "transactions_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."transactions" ADD CONSTRAINT "transactions_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."users" ADD CONSTRAINT "users_onboarding_phase_onboarding_phase_types_name_fk" FOREIGN KEY ("onboarding_phase") REFERENCES "app"."onboarding_phase_types"("name") ON DELETE no action ON UPDATE no action;