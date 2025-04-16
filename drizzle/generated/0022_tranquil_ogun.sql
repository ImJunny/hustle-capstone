CREATE TABLE "app"."disabled_notifications" (
	"user_uuid" uuid,
	"notification_type" text
);
--> statement-breakpoint
CREATE TABLE "app"."notification_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "notification_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "app"."disabled_notifications" ADD CONSTRAINT "disabled_notifications_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."disabled_notifications" ADD CONSTRAINT "disabled_notifications_notification_type_notification_types_name_fk" FOREIGN KEY ("notification_type") REFERENCES "app"."notification_types"("name") ON DELETE no action ON UPDATE no action;