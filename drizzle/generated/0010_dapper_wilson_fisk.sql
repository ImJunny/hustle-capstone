ALTER TABLE "app"."reviews" DROP CONSTRAINT "reviews_type_reviewer_types_name_fk";
--> statement-breakpoint
ALTER TABLE "app"."reviews" ALTER COLUMN "type" DROP NOT NULL;