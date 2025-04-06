CREATE TABLE "app"."job_cancellations" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"job_uuid" uuid,
	"user_uuid" uuid,
	"type" text NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."job_cancellations" ADD CONSTRAINT "job_cancellations_job_uuid_initiated_jobs_uuid_fk" FOREIGN KEY ("job_uuid") REFERENCES "app"."initiated_jobs"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."job_cancellations" ADD CONSTRAINT "job_cancellations_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE set null ON UPDATE no action;