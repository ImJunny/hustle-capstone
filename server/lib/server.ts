import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./root";
import { createTRPCContext } from "./trpc";

const app = express();
const port = 4000;

// Enable CORS for Expo
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Ensure JSON parsing

// Set up tRPC with Express
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  })
);

app.listen(port, () => {
  console.log(`🚀 tRPC server running at http://localhost:${port}`);
});
