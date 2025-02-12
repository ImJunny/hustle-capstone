CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."users" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"username" varchar,
	"first_name" text,
	"last_name" text,
	"created_at" date NOT NULL
);
