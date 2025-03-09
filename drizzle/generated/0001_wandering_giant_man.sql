CREATE TABLE "app"."reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"reviewer_uuid" uuid,
	"reviewee_uuid" uuid,
	"job_uuid" uuid,
	"service_uuid" uuid
);
--> statement-breakpoint
CREATE TABLE "app"."transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid,
	"post_uuid" uuid
);
--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_reviewer_uuid_users_uuid_fk" FOREIGN KEY ("reviewer_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_reviewee_uuid_users_uuid_fk" FOREIGN KEY ("reviewee_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_job_uuid_posts_uuid_fk" FOREIGN KEY ("job_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_service_uuid_posts_uuid_fk" FOREIGN KEY ("service_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."transactions" ADD CONSTRAINT "transactions_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."transactions" ADD CONSTRAINT "transactions_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;