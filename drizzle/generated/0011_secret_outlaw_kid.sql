CREATE TABLE "app"."reviewer_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "reviewer_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."reviews" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"reviewer_uuid" uuid NOT NULL,
	"reviewee_uuid" uuid NOT NULL,
	"review" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"job_uuid" uuid,
	"rating" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."addresses" ALTER COLUMN "user_uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."messages" ALTER COLUMN "sender_uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."messages" ALTER COLUMN "receiver_uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_reviewer_uuid_users_uuid_fk" FOREIGN KEY ("reviewer_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_reviewee_uuid_users_uuid_fk" FOREIGN KEY ("reviewee_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_type_reviewer_types_name_fk" FOREIGN KEY ("type") REFERENCES "app"."reviewer_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."reviews" ADD CONSTRAINT "reviews_job_uuid_posts_uuid_fk" FOREIGN KEY ("job_uuid") REFERENCES "app"."posts"("uuid") ON DELETE no action ON UPDATE no action;