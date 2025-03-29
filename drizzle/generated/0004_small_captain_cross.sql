ALTER TABLE "app"."payment_methods" ALTER COLUMN "stripe_payment_method_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."payment_methods" ALTER COLUMN "stripe_customer_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."payment_methods" ALTER COLUMN "card_last4" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."payment_methods" ADD COLUMN "user_uuid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."payment_methods" ADD CONSTRAINT "payment_methods_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "app"."users"("uuid") ON DELETE cascade ON UPDATE no action;