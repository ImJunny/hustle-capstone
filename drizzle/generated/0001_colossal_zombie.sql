ALTER TABLE "app"."users" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "app"."users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "app"."users" ADD COLUMN "confirmed_at" timestamp;--> statement-breakpoint
ALTER TABLE "app"."users" ADD CONSTRAINT "users_uuid_unique" UNIQUE("uuid");