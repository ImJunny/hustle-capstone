ALTER TABLE "app"."payments" DROP CONSTRAINT "payments_job_uuid_initiated_jobs_uuid_fk";
--> statement-breakpoint
ALTER TABLE "app"."payments" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."payments" ADD CONSTRAINT "payments_job_uuid_initiated_jobs_uuid_fk" FOREIGN KEY ("job_uuid") REFERENCES "app"."initiated_jobs"("uuid") ON DELETE cascade ON UPDATE no action;