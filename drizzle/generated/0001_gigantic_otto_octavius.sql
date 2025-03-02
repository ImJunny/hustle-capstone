CREATE TABLE "app"."post_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"job_post_uuid" uuid,
	"service_post_uuid" uuid
);
--> statement-breakpoint
ALTER TABLE "app"."post_images" ADD CONSTRAINT "post_images_job_post_uuid_job_posts_uuid_fk" FOREIGN KEY ("job_post_uuid") REFERENCES "app"."job_posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."post_images" ADD CONSTRAINT "post_images_service_post_uuid_service_posts_uuid_fk" FOREIGN KEY ("service_post_uuid") REFERENCES "app"."service_posts"("uuid") ON DELETE cascade ON UPDATE no action;