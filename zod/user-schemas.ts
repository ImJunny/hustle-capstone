import { z } from "zod";

export const UserSchema = z.object({
  uuid: z.string(),
});

export const CreateUserSchema = z.object({
  uuid: z.string(),
  email: z.string().email(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  created_at: z.string(),
});
