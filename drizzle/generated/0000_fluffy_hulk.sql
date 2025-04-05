CREATE SCHEMA "app";

CREATE EXTENSION postgis;

--> statement-breakpoint
CREATE TABLE "app"."addresses" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"title" text,
	"address_line_1" text,
	"address_line_2" text,
	"city" text,
	"state" text,
	"country" text,
	"zip_code" text,
	"location" geometry(point) NOT NULL,
	"visible" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "app"."chats" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"last_message_uuid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."comments" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"post_uuid" uuid NOT NULL,
	"user_uuid" uuid,
	"comment" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."following" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"follower_uuid" uuid,
	"followed_uuid" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."initiated_jobs" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"worker_uuid" uuid NOT NULL,
	"job_post_uuid" uuid NOT NULL,
	"linked_service_post_uuid" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"progress_type" text,
	"rate" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."location_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "location_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."message_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "message_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."messages" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"sender_uuid" uuid NOT NULL,
	"receiver_uuid" uuid NOT NULL,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" text DEFAULT 'text',
	"post_uuid" uuid,
	"is_read" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "app"."onboarding_phase_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "onboarding_phase_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."payments" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"job_uuid" uuid NOT NULL,
	"amount" integer NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."post_images" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"image_url" text NOT NULL,
	"post_uuid" uuid
);
--> statement-breakpoint
CREATE TABLE "app"."post_tags" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
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
	"address_uuid" uuid,
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
CREATE TABLE "app"."reviewer_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "reviewer_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."reviews" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"reviewer_uuid" uuid NOT NULL,
	"reviewee_uuid" uuid NOT NULL,
	"review" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"job_uuid" uuid,
	"rating" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."saved_posts" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"post_uuid" uuid NOT NULL
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
	"username" varchar,
	"display_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"bio" text,
	"avatar_url" text,
	"date_of_birth" date,
	"onboarding_phase" text,
	"stripe_customer_id" text,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "app"."addresses" ADD CONSTRAINT "addresses_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."chats" ADD CONSTRAINT "chats_last_message_uuid_messages_uuid_fk" FOREIGN KEY ("last_message_uuid") REFERENCES "app"."messages"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."comments" ADD CONSTRAINT "comments_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."comments" ADD CONSTRAINT "comments_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_worker_uuid_users_uuid_fk" FOREIGN KEY ("worker_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_job_post_uuid_posts_uuid_fk" FOREIGN KEY ("job_post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_linked_service_post_uuid_posts_uuid_fk" FOREIGN KEY ("linked_service_post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_progress_type_progress_types_name_fk" FOREIGN KEY ("progress_type") REFERENCES "app"."progress_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."messages" ADD CONSTRAINT "messages_sender_uuid_users_uuid_fk" FOREIGN KEY ("sender_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."messages" ADD CONSTRAINT "messages_receiver_uuid_users_uuid_fk" FOREIGN KEY ("receiver_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."messages" ADD CONSTRAINT "messages_type_message_types_name_fk" FOREIGN KEY ("type") REFERENCES "app"."message_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."messages" ADD CONSTRAINT "messages_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."payments" ADD CONSTRAINT "payments_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."payments" ADD CONSTRAINT "payments_job_uuid_initiated_jobs_uuid_fk" FOREIGN KEY ("job_uuid") REFERENCES "app"."initiated_jobs"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_images" ADD CONSTRAINT "post_images_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_tags" ADD CONSTRAINT "post_tags_tag_type_tag_types_name_fk" FOREIGN KEY ("tag_type") REFERENCES "app"."tag_types"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_tags" ADD CONSTRAINT "post_tags_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."posts" ADD CONSTRAINT "posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."posts" ADD CONSTRAINT "posts_location_type_location_types_name_fk" FOREIGN KEY ("location_type") REFERENCES "app"."location_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."posts" ADD CONSTRAINT "posts_address_uuid_addresses_uuid_fk" FOREIGN KEY ("address_uuid") REFERENCES "app"."addresses"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."posts" ADD CONSTRAINT "posts_status_type_status_types_name_fk" FOREIGN KEY ("status_type") REFERENCES "app"."status_types"("name") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_reviewer_uuid_users_uuid_fk" FOREIGN KEY ("reviewer_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_reviewee_uuid_users_uuid_fk" FOREIGN KEY ("reviewee_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_type_reviewer_types_name_fk" FOREIGN KEY ("type") REFERENCES "app"."reviewer_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_job_uuid_posts_uuid_fk" FOREIGN KEY ("job_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."saved_posts" ADD CONSTRAINT "saved_posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."saved_posts" ADD CONSTRAINT "saved_posts_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."users" ADD CONSTRAINT "users_onboarding_phase_onboarding_phase_types_name_fk" FOREIGN KEY ("onboarding_phase") REFERENCES "app"."onboarding_phase_types"("name") ON DELETE no action ON UPDATE no action;