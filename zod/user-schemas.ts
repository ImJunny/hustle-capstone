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
});

export const UpdateUserProfileSchema = z.object({
  uuid: z.string(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  bio: z.string(),
});

export const UpdateUserAvatarSchema = z.object({
  image_uri: z.string(),
  uuid: z.string(),
});
