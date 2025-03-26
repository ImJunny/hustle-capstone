-- Enable Supabase Realtime for some tables --
CREATE POLICY "Enable read access for all users" ON "app"."chats" AS PERMISSIVE FOR SELECT TO authenticated USING (true);
ALTER publication supabase_realtime ADD TABLE "app"."chats";

CREATE POLICY "Enable read access for all users" ON "app"."messages" AS PERMISSIVE FOR SELECT TO authenticated USING (true);
ALTER publication supabase_realtime ADD TABLE "app"."messages";