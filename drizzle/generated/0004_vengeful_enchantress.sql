CREATE TABLE "app"."message_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "message_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "app"."messages" ADD COLUMN "type" text DEFAULT 'text';--> statement-breakpoint
ALTER TABLE "app"."messages" ADD COLUMN "post_uuid" uuid;--> statement-breakpoint
ALTER TABLE "app"."messages" ADD CONSTRAINT "messages_type_message_types_name_fk" FOREIGN KEY ("type") REFERENCES "app"."message_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."messages" ADD CONSTRAINT "messages_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;