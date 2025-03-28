CREATE TABLE "app"."saved_posts" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"post_uuid" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."saved_posts" ADD CONSTRAINT "saved_posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."saved_posts" ADD CONSTRAINT "saved_posts_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;