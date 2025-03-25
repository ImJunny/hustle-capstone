CREATE TABLE "app"."chats" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"last_message_uuid" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."chats" ADD CONSTRAINT "chats_last_message_uuid_messages_uuid_fk" FOREIGN KEY ("last_message_uuid") REFERENCES "app"."messages"("uuid") ON DELETE no action ON UPDATE no action;