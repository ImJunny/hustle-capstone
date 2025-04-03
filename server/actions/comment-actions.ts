import { ServiceFee } from "@/constants/Rates";
import { db } from "@/drizzle/db";
import { comments, users } from "@/drizzle/schema";
import { and, eq, ne, sql } from "drizzle-orm";

// UPDATE JOB PROGRESS
export async function getComments(post_uuid: string, user_uuid: string) {
  try {
    const result = await db
      .select({
        uuid: comments.uuid,
        timestamp: comments.timestamp,
        comment: comments.comment,
        user_username: users.username,
        user_avatar_url: users.avatar_url,
      })
      .from(comments)
      .where(eq(comments.post_uuid, post_uuid))
      .innerJoin(users, eq(users.uuid, comments.user_uuid));
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get comments.");
  }
}
export type Comment = Awaited<ReturnType<typeof getComments>>[number];
