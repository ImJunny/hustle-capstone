import { db } from "@/drizzle/db";
import { reported_posts } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function reportPost(
  uuid: string,
  user_uuid: string,
  reason: string
) {
  try {
    await db.insert(reported_posts).values({
      post_uuid: uuid,
      user_uuid,
      reason,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to report post.");
  }
}

export async function isReportedPost(uuid: string, user_uuid: string) {
  try {
    const result = await db
      .select()
      .from(reported_posts)
      .where(
        and(
          eq(reported_posts.post_uuid, uuid),
          eq(reported_posts.user_uuid, user_uuid)
        )
      )
      .limit(1)
      .then((result) => result.length > 0);

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to check if post is reported.");
  }
}

export async function undoReportPost(uuid: string, user_uuid: string) {
  try {
    await db
      .delete(reported_posts)
      .where(
        and(
          eq(reported_posts.post_uuid, uuid),
          eq(reported_posts.user_uuid, user_uuid)
        )
      );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to undo report.");
  }
}
