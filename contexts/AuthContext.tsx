import { supabase } from "@/server/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";

const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
  geocode: [number, number] | null;
  setGeocode: Dispatch<SetStateAction<[number, number] | null>>;
}>({ session: null, user: null, geocode: null, setGeocode: () => {} });

export function useAuthData() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [geocode, setGeocode] = useState<[number, number] | null>(null);

  async function fetchData() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
  }

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setGeocode([location.coords.latitude, location.coords.longitude]);
        return location;
      } else {
        return null;
      }
    })();
  }, []);

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

  const value = { session, user, geocode, setGeocode };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
