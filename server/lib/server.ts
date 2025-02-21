import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./root";

const app = express();
const port = 4000;

// Enable CORS for Expo
app.use(cors());
app.use(express.json()); // Ensure JSON parsing

// Create tRPC context
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});

// Set up tRPC with Express
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(port, () => {
  console.log(`🚀 tRPC server running at http://localhost:${port}`);
});
