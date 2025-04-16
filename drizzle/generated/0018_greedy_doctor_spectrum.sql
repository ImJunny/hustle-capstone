CREATE TABLE "app"."tag_preferences" (
	"user_uuid" uuid NOT NULL,
	"tag_type" text NOT NULL,
	"weight" numeric NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."tag_preferences" ADD CONSTRAINT "tag_preferences_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."tag_preferences" ADD CONSTRAINT "tag_preferences_tag_type_tag_types_name_fk" FOREIGN KEY ("tag_type") REFERENCES "app"."tag_types"("name") ON DELETE no action ON UPDATE no action;