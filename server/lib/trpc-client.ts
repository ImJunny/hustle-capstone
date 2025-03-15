import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { AppRouter } from "./root";
import { QueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { supabase } from "./supabase";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

const LOCAL_IP = Constants.expoConfig?.hostUri
  ? `http://${Constants.expoConfig.hostUri.split(":")[0]}:4000`
  : "http://192.168.1.100:3000";

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${LOCAL_IP}/trpc`,
      async headers() {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        return {
          authorization: `Bearer ${session?.access_token}`,
        };
      },
    }),
  ],
});
