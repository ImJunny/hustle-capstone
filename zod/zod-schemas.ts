import { z } from "zod";

export const EditProfileSchema = z.object({
  username: z.string().min(1, "Username cannot be empty."),
  firstname: z.string().min(1, "First name cannot be empty."),
  lastname: z.string().min(1, "Last name cannot be empty."),
  bio: z.string().optional(),
});

export const CreatePostSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters."),
  description: z
    .string()
    .min(40, "Description must be at least 40 characters."),
});
