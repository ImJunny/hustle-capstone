import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  updateOnboardingDateOfBirth,
  updateOnboardingFirstName,
  updateOnboardingProfileImage,
  updateOnboardingUsername,
} from "../actions/onboarding-actions";

export const onboardingRouter = createTRPCRouter({
  update_onboarding_date_of_birth: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        date_of_birth: z.coerce.date(),
      })
    )
    .mutation(async ({ input }) => {
      await updateOnboardingDateOfBirth(input.uuid, input.date_of_birth);
    }),

  update_onboarding_first_name: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        first_name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await updateOnboardingFirstName(input.uuid, input.first_name);
    }),

  update_onboarding_username: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await updateOnboardingUsername(input.uuid, input.username);
    }),

  update_onboarding_profile_image: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        image_buffer: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      await updateOnboardingProfileImage(input.uuid, input.image_buffer);
    }),
});
