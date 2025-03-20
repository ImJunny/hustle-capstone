CREATE TABLE "app"."accepted_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid NOT NULL,
	"job_uuid" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."accepted_jobs" ADD CONSTRAINT "accepted_jobs_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."accepted_jobs" ADD CONSTRAINT "accepted_jobs_job_uuid_posts_uuid_fk" FOREIGN KEY ("job_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;