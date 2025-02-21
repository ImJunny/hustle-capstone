// supabaseClient.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

let supabase: SupabaseClient<any, "app", any>;

if (typeof window !== "undefined") {
  // Client-side: use AsyncStorage
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    db: {
      schema: "app",
    },
  });
} else {
  // Server-side: skip storage configuration or provide a fallback
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: "app",
    },
  });
}

export { supabase };
