CREATE TABLE "app"."addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid,
	"title" text,
	"address_line_1" text,
	"address_line_2" text,
	"city" text,
	"state" text,
	"zip_code" text
);
--> statement-breakpoint
ALTER TABLE "app"."addresses" ADD CONSTRAINT "addresses_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;