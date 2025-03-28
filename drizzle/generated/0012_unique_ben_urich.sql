CREATE TABLE "app"."saved_post" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"post_uuid" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."saved_post" ADD CONSTRAINT "saved_post_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."saved_post" ADD CONSTRAINT "saved_post_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;