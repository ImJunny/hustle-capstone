CREATE TABLE "app"."viewed_posts" (
	"post_uuid" uuid NOT NULL,
	"user_uuid" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "viewed_posts_post_uuid_user_uuid_pk" PRIMARY KEY("post_uuid","user_uuid")
);
--> statement-breakpoint
ALTER TABLE "app"."viewed_posts" ADD CONSTRAINT "viewed_posts_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."viewed_posts" ADD CONSTRAINT "viewed_posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;