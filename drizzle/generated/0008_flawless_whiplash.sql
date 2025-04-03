CREATE TABLE "app"."comments" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"post_uuid" uuid NOT NULL,
	"user_uuid" uuid,
	"comment" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."payments" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"job_uuid" uuid NOT NULL,
	"amount" integer NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"payment_method_uuid" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."comments" ADD CONSTRAINT "comments_post_uuid_posts_uuid_fk" FOREIGN KEY ("post_uuid") REFERENCES "app"."posts"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."comments" ADD CONSTRAINT "comments_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."payments" ADD CONSTRAINT "payments_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."payments" ADD CONSTRAINT "payments_job_uuid_initiated_jobs_uuid_fk" FOREIGN KEY ("job_uuid") REFERENCES "app"."initiated_jobs"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."payments" ADD CONSTRAINT "payments_payment_method_uuid_payment_methods_uuid_fk" FOREIGN KEY ("payment_method_uuid") REFERENCES "app"."payment_methods"("uuid") ON DELETE no action ON UPDATE no action;