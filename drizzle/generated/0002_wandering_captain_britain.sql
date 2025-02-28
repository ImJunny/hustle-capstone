CREATE TABLE "app"."onboarding_phase_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "onboarding_phase_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "app"."users" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "app"."users" ADD COLUMN "onboarding_phase" text;--> statement-breakpoint
ALTER TABLE "app"."users" ADD CONSTRAINT "users_onboarding_phase_onboarding_phase_types_name_fk" FOREIGN KEY ("onboarding_phase") REFERENCES "app"."onboarding_phase_types"("name") ON DELETE no action ON UPDATE no action;