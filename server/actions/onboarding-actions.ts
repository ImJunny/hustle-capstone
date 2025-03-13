import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq, and, ne, ilike } from "drizzle-orm";
import { uploadImage } from "./s3-actions";

// Update onboarding date of birth
export async function updateOnboardingDateOfBirth(
  uuid: string,
  date_of_birth: Date
) {
  try {
    await db
      .update(users)
      .set({
        date_of_birth: date_of_birth.toDateString(),
        onboarding_phase: "username",
      })
      .where(eq(users.uuid, uuid));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update date of birth.");
  }
}

// Update onboarding user name
export async function updateOnboardingUsername(uuid: string, username: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(ilike(users.username, username));

    if (result.length > 0 && result[0].uuid !== uuid) {
      throw new Error("Username already taken.");
    }

    await db
      .update(users)
      .set({
        username,
        onboarding_phase: "display name",
      })
      .where(eq(users.uuid, uuid));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update username.");
  }
}

// Update onboarding display name
export async function updateOnboardingDisplayName(
  uuid: string,
  display_name: string
) {
  try {
    await db
      .update(users)
      .set({
        display_name,
        onboarding_phase: "profile image",
      })
      .where(eq(users.uuid, uuid));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update display name.");
  }
}

// Update onboarding compeleted
export async function updateOnboardingProfileImage(
  uuid: string,
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
        onboarding_phase: "completed",
      })
      .where(eq(users.uuid, uuid));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update profile image.");
  }
}
