ALTER TABLE "app"."payments" DROP CONSTRAINT "payments_receiver_uuid_users_uuid_fk";
--> statement-breakpoint
ALTER TABLE "app"."payments" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "app"."payments" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."payments" DROP COLUMN "receiver_uuid";