CREATE TABLE "app"."post_report_reasons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "post_report_reasons_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."reported_posts" (
	"post_uuid" uuid NOT NULL,
	"user_uuid" uuid NOT NULL,
	"reason" text,
	CONSTRAINT "reported_posts_post_uuid_user_uuid_pk" PRIMARY KEY("post_uuid","user_uuid")
);
--> statement-breakpoint
ALTER TABLE "app"."reported_posts" ADD CONSTRAINT "reported_posts_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reported_posts" ADD CONSTRAINT "reported_posts_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reported_posts" ADD CONSTRAINT "reported_posts_reason_post_report_reasons_name_fk" FOREIGN KEY ("reason") REFERENCES "app"."post_report_reasons"("name") ON DELETE no action ON UPDATE no action;