-- Custom SQL migration file, put your code below! --CREATE POLICY "Enable read access for all users" ON "app"."chats" AS PERMISSIVE FOR SELECT TO authenticated USING (true);
ALTER publication supabase_realtime ADD TABLE "app"."chats";
grant select on app.chats to anon, authenticated;

CREATE POLICY "Enable read access for all users" ON "app"."messages" AS PERMISSIVE FOR SELECT TO authenticated USING (true);
ALTER publication supabase_realtime ADD TABLE "app"."messages";