import { supabase } from "@/server/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";

const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
}>({ session: null, user: null });

export function useAuthData() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  async function fetchData() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
  }

  useEffect(() => {
    fetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
      subscription.remove();
    };
  }, []);

  const value = { session, user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
