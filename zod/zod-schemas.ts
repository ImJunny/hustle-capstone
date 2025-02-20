import { tagTypes } from "@/server/lib/db-types";
import { z } from "zod";

export const EditProfileSchema = z.object({
  username: z.string().min(1, "Username cannot be empty."),
  firstname: z.string().min(1, "First name cannot be empty."),
  lastname: z.string().min(1, "Last name cannot be empty."),
  bio: z.string().optional(),
});

export const CreateJobSchema = z
  .object({
    title: z.string().min(10, "Title must be at least 10 characters."),
    description: z
      .string()
      .min(40, "Description must be at least 40 characters."),
    min_rate: z.number(),
    max_rate: z.number().optional(),
    location_type: z.enum(["local", "remote"]),
    location_address: z.string().optional(),
    due_date: z.date().refine((data) => !isNaN(data.getTime()), {
      message: "Due date is required.",
    }),
    tags: z.array(z.enum(tagTypes)).optional(),
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

    if (
      data.location_type === "local" &&
      (!data.location_address || data.location_address.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["location_address"],
        message: "Location address is required if the job is local.",
      });
    }
  });
