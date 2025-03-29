CREATE TABLE "app"."payment_methods" (
	"stripe_payment_method_id" varchar(255) NOT NULL,
	"stripe_customer_id" varchar(255) NOT NULL,
	"card_last4" varchar(4) NOT NULL,
	"is_default" boolean DEFAULT false,
	"visible" boolean DEFAULT true
);
