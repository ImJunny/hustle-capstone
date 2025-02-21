import { supabase } from "@/server/lib/supabase";

export const createContext = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    supabase,
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
