import { db } from "../../drizzle/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm/sql";
import { uploadImage } from "./s3-actions";

// Create user
export async function createUser(
  uuid: string,
  email: string,
  username: string,
  first_name: string,
  last_name: string
) {
  try {
    await db.insert(users).values({
      uuid,
      email,
      username: username.toLowerCase(),
      first_name,
      last_name,
    });
    return first_name;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create user.");
  }
}

// Get user data
export async function getUserData(uuid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uuid, uuid));
    return result[0];
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching user data.");
  }
}
export type UserData = Awaited<ReturnType<typeof getUserData>>;

// Update user profile from edit-profile
export async function updateUserProfile(
  uuid: string,
  username: string,
  first_name: string,
  last_name: string,
  bio: string
) {
  try {
    await db
      .update(users)
      .set({
        username,
        first_name,
        last_name,
        bio,
      })
      .where(eq(users.uuid, uuid));
  } catch (error) {
    throw new Error("Error updating profile.");
  }
}

// Update user avatar while uploading to s3; the image is the same name as the user's uuid
export async function updateUserAvatar(
  uuid: string,
  image_buffer: ArrayBuffer
) {
  try {
    uploadImage(uuid, image_buffer);
    await db
      .update(users)
      .set({
        avatar_url: `${
          process.env.EXPO_PUBLIC_AWS_IMAGE_BASE_URL
        }/${uuid}?=${new Date().getTime()}`,
      })
      .where(eq(users.uuid, uuid));
  } catch (error) {
    throw new Error("Error updating user avatar");
  }
}
