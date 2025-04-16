CREATE TABLE "app"."notifications" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_uuid" uuid,
	"post_uuid" uuid,
	"text" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."notifications" ADD CONSTRAINT "notifications_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;