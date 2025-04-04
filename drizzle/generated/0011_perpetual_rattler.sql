CREATE TABLE "app"."following" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"follower_uuid" uuid,
	"followed_uuid" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
