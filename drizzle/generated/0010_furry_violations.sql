ALTER TABLE "app"."payment_methods" ADD COLUMN "card_brand" text NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."payments" DROP COLUMN "card_brand";