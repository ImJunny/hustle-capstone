import { Database, db } from "../../drizzle/db";
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
    const result = await db.query.users.findFirst({
      where: eq(users.uuid, uuid),
    });
    return result;
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
    console.log(uuid);
    await db
      .update(users)
      .set({
        username,
        first_name,
        last_name,
        bio,
      })
      .where(eq(users.uuid, uuid));
    const first = await db.query.users.findFirst({
      columns: { first_name: true },
      where: eq(users.uuid, uuid),
    });
    console.log(first_name, first);
  } catch (error) {
    throw new Error("Error updating profile.");
  }
}

// Update user avatar while uploading to s3; the image is the same name as the user's uuid
export async function updateUserAvatar(
  db: Database,
  uuid: string,
  image_uri: string
) {
  console.log("updating image");
  try {
    if (image_uri) {
      uploadImage(image_uri, uuid);
      await db
        .update(users)
        .set({
          avatar_url: `${
            process.env.EXPO_PUBLIC_AWS_IMAGE_BASE_URL
          }/${uuid}?=${new Date().getTime()}`,
        })
        .where(eq(users.uuid, uuid));
    }
  } catch (error) {
    throw new Error("Error updating user avatar");
  }
}
