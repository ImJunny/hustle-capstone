import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";

import { QueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { AppRouter } from "@/server/routers/root-router";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

const LOCAL_IP = Constants.expoConfig?.hostUri
  ? `http://${Constants.expoConfig.hostUri.split(":")[0]}:3000`
  : "http://192.168.1.100:3000";

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${LOCAL_IP}/trpc`,
    }),
  ],
});
