import { countries } from "@/constants/Data";
import { tagTypes } from "@/drizzle/db-types";
import { z } from "zod";

export const EditProfileSchema = z.object({
  username: z.string().min(1, "Username cannot be empty."),
  display_name: z.string().min(1, "Display name cannot be empty."),
  bio: z.string().optional(),
});

export const OnboardingFormSchema = z.object({
  date_of_birth: z.date().refine(
    (value) => {
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
      );
      return value <= minAgeDate; // Ensures user is at least 16
    },
    {
      message: "Must be at least 16 years of age.",
    }
  ),
  username: z
    .string()
    .min(1, "Username is required.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username must contain only letters, numbers, and underscores."
    ),
  display_name: z.string().min(1, "First name is required."),
  image_buffer: z.any(),
});

export const CreatePostSchema = z
  .object({
    type: z.enum(["work", "hire"]).default("work"),
    title: z.string().min(10, "Title must be at least 10 characters."),
    description: z
      .string()
      .min(40, "Description must be at least 40 characters."),
    min_rate: z.number(),
    max_rate: z.number().optional(),
    location_type: z.enum(["local", "remote"]),
    address_uuid: z.string().nullable(),
    due_date: z.date({ message: "Due date is required." }).nullable(),
    tags: z.array(z.enum(tagTypes)).optional(),
    images: z.array(z.any()).min(1, "Must include at least one image."),
  })
  .superRefine((data, ctx) => {
    if (
      (data.max_rate && data.min_rate >= data.max_rate) ||
      data.max_rate === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["min_rate"],
        message: "Max rate must be greater than min rate.",
      });
    }

    if (data.location_type === "local" && data.address_uuid === null) {
      ctx.addIssue({
        code: "custom",
        path: ["address_uuid"],
        message: "Location address is required if the job is local.",
      });
    }

    if (data.type === "work" && data.due_date === null) {
      ctx.addIssue({
        code: "custom",
        path: ["due_date"],
        message: "Due date is required.",
      });
    }
  });

export const CreateAddressSchema = z
  .object({
    address_title: z.string().min(1, "Required"),
    country: z.enum(
      countries.map((country) => country.value) as [string, ...string[]],
      { message: "Required" }
    ),
    address_line_1: z.string().min(1, "Required"),
    address_line_2: z.string().optional(),
    city: z.string().min(1, "Required").optional(),
    state: z.string().min(1, "Required").optional(),
    zip: z.string().min(1, "Required"),
  })
  .superRefine((data, ctx) => {
    if (data.country === "united_states") {
      if (!data.city)
        ctx.addIssue({
          code: "custom",
          path: ["city"],
          message: "City is required for the United States.",
        });
      if (!data.state)
        ctx.addIssue({
          code: "custom",
          path: ["state"],
          message: "State is required for the United States.",
        });
    }
  });

export const CreatePaymentMethodSchema = z
  .object({
    card_last4: z
      .string()
      .length(4, "Card number must be 4 digits") // Storing last 4 digits
      .regex(/^\d{4}$/, "Card number must be only digits"),

    expiration_date: z
      .string()
      .length(7, "Expiration date must be in MM/YYYY format")
      .regex(
        /^(0[1-9]|1[0-2])\/\d{4}$/,
        "Expiration date must be in MM/YYYY format"
      ),

    billing_address: z
      .object({
        address_line_1: z.string().min(1, "Address Line 1 is required"),
        address_line_2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        country: z.enum(
          countries.map((country) => country.value) as [string, ...string[]],
          { message: "Country is required" }
        ),
        zip: z.string().min(1, "ZIP code is required"),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Ensure expiration date is valid
    const [month, year] = data.expiration_date.split("/").map(Number);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

    // Check that expiration year is not in the past
    if (year < currentYear) {
      ctx.addIssue({
        code: "custom",
        path: ["expiration_date"],
        message: "Expiration year must be in the future",
      });
    } else if (year === currentYear && month < currentMonth) {
      ctx.addIssue({
        code: "custom",
        path: ["expiration_date"],
        message: "Expiration month must be in the future",
      });
    }
  });
