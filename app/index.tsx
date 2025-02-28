import { Redirect } from "expo-router";
import { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../server/lib/supabase";
import { trpc } from "@/server/lib/trpc-client";
import Text from "@/components/ui/Text";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function RootIndex() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      setUser(sessionData.session!.user);

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

  const [user, setUser] = useState<User | undefined>();
  const { data: userData, isLoading } = trpc.user.get_user_data.useQuery(
    {
      uuid: user?.id ?? "",
    },
    { enabled: !!user }
  );

  if (loading || isLoading) return <LoadingScreen />;
  if (user) {
    if (
      userData?.onboarding_phase == null ||
      userData?.onboarding_phase === "date of birth"
    )
      return <Redirect href="/onboarding/date-of-birth" />;
    else if (userData?.onboarding_phase === "first name")
      return <Redirect href="/onboarding/first-name" />;
    else if (userData?.onboarding_phase === "username")
      return <Redirect href="/onboarding/username" />;
    else if (userData?.onboarding_phase === "profile image")
      return <Redirect href="/onboarding/profile-image" />;
    else if (userData?.onboarding_phase === "completed")
      return <Redirect href="/(main)/(tabs)" />;
  }
  return <Redirect href="/signin" />;
}
