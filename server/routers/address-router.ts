import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import { findSuggestedAddress } from "../actions/address-actions";

export const addressRouter = createTRPCRouter({
  find_suggested_address: protectedProcedure
    .input(
      z.object({
        encoded_address: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await findSuggestedAddress(input.encoded_address);
      return result;
    }),
});
