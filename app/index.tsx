import { Redirect } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../server/lib/supabase";

export default function RootIndex() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);

      if (sessionData.session) {
        const { data: user, error } = await supabase.auth.getUser();
        if (!user || error) {
          await supabase.auth.signOut();
          setSession(null);
        }
      }
      setLoading(false);
    }

    checkSession();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) return null;

  if (session) return <Redirect href="/(main)/(tabs)" />;
  else return <Redirect href="/signin" />;
}
