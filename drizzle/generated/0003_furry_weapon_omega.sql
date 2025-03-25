CREATE TABLE "app"."messages" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"sender_uuid" uuid,
	"receiver_uuid" uuid,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."messages" ADD CONSTRAINT "messages_sender_uuid_users_uuid_fk" FOREIGN KEY ("sender_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."messages" ADD CONSTRAINT "messages_receiver_uuid_users_uuid_fk" FOREIGN KEY ("receiver_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;