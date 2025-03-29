import { Redirect } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../server/lib/supabase";
import { trpc } from "@/server/lib/trpc-client";
import LoadingView from "@/components/ui/LoadingView";

export default function RootIndex() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
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
  }, [loading]);

  const { data: userData, isFetching } = trpc.user.get_user_data.useQuery(
    {
      uuid: session?.user.id ?? "",
    },
    { enabled: !!session?.user }
  );

  if (loading || isFetching) return <LoadingView />;
  if (session?.user) {
    if (
      userData?.onboarding_phase == null ||
      userData?.onboarding_phase === "date of birth"
    )
      return <Redirect href="/onboarding/date-of-birth" />;
    else if (userData?.onboarding_phase === "username")
      return <Redirect href="/onboarding/username" />;
    else if (userData?.onboarding_phase === "display name")
      return <Redirect href="/onboarding/display-name" />;
    else if (userData?.onboarding_phase === "profile image")
      return <Redirect href="/onboarding/profile-image" />;
    else if (userData?.onboarding_phase === "completed")
      return <Redirect href="/(main)/(tabs)" />;
  }
  return <Redirect href="/signin" />;
}
