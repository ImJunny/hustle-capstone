ALTER TABLE "app"."payments" ALTER COLUMN "status" SET DEFAULT 'income';--> statement-breakpoint
ALTER TABLE "app"."payments" ALTER COLUMN "status" DROP NOT NULL;