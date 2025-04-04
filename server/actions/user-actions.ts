import { db } from "../../drizzle/db";
import { following, users } from "../../drizzle/schema";
import { and, desc, eq, sql } from "drizzle-orm/sql";
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
export async function getUserData(uuid: string, their_uuid?: string) {
  try {
    const baseSelect = {
      uuid: users.uuid,
      email: users.email,
      username: users.username,
      display_name: users.display_name,
      created_at: users.created_at,
      bio: users.bio,
      avatar_url: users.avatar_url,
      date_of_birth: users.date_of_birth,
      onboarding_phase: users.onboarding_phase,
    };

    const selectFields = their_uuid
      ? {
          ...baseSelect,
          is_following: sql<boolean>`EXISTS (
            SELECT 1 FROM ${following}
            WHERE ${following.follower_uuid} = ${uuid}
            AND ${following.followed_uuid} = ${their_uuid}
          )`.as("is_following"),
        }
      : {
          ...baseSelect,
          is_following: sql<boolean>`false`.as("is_following"),
        };

    const [result] = await db
      .select(selectFields)
      .from(users)
      .where(eq(users.uuid, their_uuid ?? uuid));
    return result;
  } catch (error) {
    console.error(error);
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

export async function followUser(follower_uuid: string, followed_uuid: string) {
  try {
    const isFollowed = await db
      .select()
      .from(following)
      .where(
        and(
          eq(following.follower_uuid, follower_uuid),
          eq(following.followed_uuid, followed_uuid)
        )
      )
      .limit(1)
      .then(([result]) => !!result);

    if (!isFollowed)
      await db.insert(following).values({
        follower_uuid,
        followed_uuid,
      });
  } catch (error) {
    console.log(error);
    throw new Error("Error following user.");
  }
}

export async function unfollowUser(
  follower_uuid: string,
  followed_uuid: string
) {
  try {
    await db
      .delete(following)
      .where(
        and(
          eq(following.follower_uuid, follower_uuid),
          eq(following.followed_uuid, followed_uuid)
        )
      );
  } catch (error) {
    console.log(error);
    throw new Error("Error unfollowing user.");
  }
}

export async function getFollowing(user_uuid: string) {
  try {
    const result = await db
      .select({
        uuid: users.uuid,
        username: users.username,
        display_name: users.display_name,
        avatar_url: users.avatar_url,
      })
      .from(following)
      .where(eq(following.follower_uuid, user_uuid))
      .innerJoin(users, eq(users.uuid, following.followed_uuid))
      .orderBy(desc(following.created_at));
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting users following.");
  }
}
export type SimpleUserData = Awaited<ReturnType<typeof getFollowing>>[number];
