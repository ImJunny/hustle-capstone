ALTER TABLE "app"."addresses" ADD COLUMN "location" geometry(point) NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."addresses" DROP COLUMN "longitude";--> statement-breakpoint
ALTER TABLE "app"."addresses" DROP COLUMN "latitude";