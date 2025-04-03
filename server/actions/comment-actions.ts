import { ServiceFee } from "@/constants/Rates";
import { db } from "@/drizzle/db";
import { comments, users } from "@/drizzle/schema";
import { and, asc, desc, eq, ne, sql } from "drizzle-orm";

// GET COMMENTS
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
      .innerJoin(users, eq(users.uuid, comments.user_uuid))
      .orderBy(desc(comments.timestamp));
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get comments.");
  }
}
export type Comment = Awaited<ReturnType<typeof getComments>>[number];

// SEND COMMENT
export async function sendComment(
  post_uuid: string,
  user_uuid: string,
  comment: string
) {
  try {
    await db.insert(comments).values({
      post_uuid,
      user_uuid,
      comment,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send comment.");
  }
}
