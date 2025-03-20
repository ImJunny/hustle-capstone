import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  createAddress,
  deleteAddress,
  findSuggestedAddress,
  getAddressInfo,
  getUserAddresses,
  updateAddress,
} from "../actions/address-actions";

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

  create_address: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        title: z.string(),
        address_line_1: z.string(),
        address_line_2: z.string().optional(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        zip_code: z.string(),
        longitude: z.number(),
        latitude: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await createAddress(
        input.user_uuid,
        input.title,
        input.address_line_1,
        input.address_line_2,
        input.city,
        input.state,
        input.country,
        input.zip_code,
        input.longitude,
        input.latitude
      );
    }),
  update_address: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        address_line_1: z.string(),
        address_line_2: z.string().optional(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        zip_code: z.string(),
        longitude: z.number(),
        latitude: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await updateAddress(
        input.id,
        input.title,
        input.address_line_1,
        input.address_line_2,
        input.city,
        input.state,
        input.country,
        input.zip_code,
        input.longitude,
        input.latitude
      );
    }),
  get_user_addresses: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await getUserAddresses(input.user_uuid);
      return result;
    }),
  delete_address: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteAddress(input.id);
    }),
  get_address_info: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await getAddressInfo(input.id);
    }),
});
