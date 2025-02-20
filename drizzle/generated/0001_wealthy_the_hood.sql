ALTER TABLE "app"."initiated_jobs" ADD COLUMN "worker_uuid" uuid;--> statement-breakpoint
ALTER TABLE "app"."posts" ADD COLUMN "poster_uuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."initiated_jobs" ADD CONSTRAINT "initiated_jobs_worker_uuid_users_uuid_fk" FOREIGN KEY ("worker_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."posts" ADD CONSTRAINT "posts_poster_uuid_users_uuid_fk" FOREIGN KEY ("poster_uuid") REFERENCES "app"."users"("uuid") ON DELETE cascade ON UPDATE no action;