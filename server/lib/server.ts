import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers/root-router";
import { createContext } from "./context";
const app = express();
app.use(cors()); // Allow cross-origin requests

// Add tRPC middleware
app.use(
  "/trpc",
  createExpressMiddleware({ router: appRouter, createContext: createContext })
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
