import { db } from "../../drizzle/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm/sql";
import { uploadImage } from "./s3-actions";

// Check if user exists
export async function doesUserExist(uuid: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.uuid, uuid))
      .limit(1);
    if (result[0]) return true;
    return false;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to check if user exists.");
  }
}

// Create user
export async function createUser(uuid: string, email: string) {
  try {
    const exists = await doesUserExist(uuid);
    if (exists) {
      const result = await db
        .select({ onboarding_phase: users.onboarding_phase })
        .from(users)
        .where(eq(users.uuid, uuid));
      return result[0];
    }
    await db.insert(users).values({
      uuid,
      email,
      onboarding_phase: "date of birth",
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create user.");
  }
}
export type createUserReturn = Awaited<ReturnType<typeof createUser>>;

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
  display_name: string,
  bio: string,
  image_buffer: ArrayBuffer | null
) {
  try {
    if (image_buffer) {
      uploadImage(uuid, image_buffer);
      await db
        .update(users)
        .set({
          avatar_url: `${
            process.env.EXPO_PUBLIC_AWS_IMAGE_BASE_URL
          }/${uuid}?=${new Date().getTime()}`,
        })
        .where(eq(users.uuid, uuid));
    }
    await db
      .update(users)
      .set({
        username,
        display_name,
        bio,
      })
      .where(eq(users.uuid, uuid));
  } catch (error) {
    console.log(error);
    throw new Error("Error updating profile.");
  }
}

export async function getPersonalInfo(uuid: string) {
  try {
    const result = await db
      .select({
        email: users.email,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.uuid, uuid));
    return result[0];
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching user data.");
  }
}
export type PersonalInfo = Awaited<ReturnType<typeof getPersonalInfo>>;
