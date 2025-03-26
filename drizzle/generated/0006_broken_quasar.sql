-- Enable row level security for all tables --
ALTER TABLE "app"."messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."chats" ENABLE ROW LEVEL SECURITY;

-- ALTER TABLE "app"."addresses" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."initiated_jobs" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."location_types" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."message_types" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."onboarding_phase_types" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."post_images" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."post_tags" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."posts" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."progress_types" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."reviews" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."status_types" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."tag_types" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."transactions" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "app"."users" ENABLE ROW LEVEL SECURITY;