import { db } from "../../drizzle/db";
import {
  post_images,
  post_tags,
  users,
  posts,
  addresses,
  initiated_jobs,
  saved_posts,
  comments,
  reviews,
  viewed_posts,
  tag_preferences,
} from "../../drizzle/schema";
import {
  eq,
  ilike,
  or,
  asc,
  desc,
  and,
  ne,
  gte,
  lte,
  sql,
  exists,
  inArray,
} from "drizzle-orm/sql";
import { uploadImage } from "./s3-actions";
import { v4 as uuidv4 } from "uuid";
import { getIsDataSafe } from "./llm-actions";
import { sendEmail } from "./email-actions";

export async function updateTagPreference(
  user_uuid: string,
  post_uuid: string,
  multiplier: number
) {
  try {
    // get post tags
    const postTags = await db
      .select()
      .from(post_tags)
      .where(eq(post_tags.post_uuid, post_uuid))
      .then((result) => result.map((tag) => tag.tag_type));

    // create tag preference if it doesnt exist yet
    await Promise.all(
      postTags.map(async (tag) => {
        const preferenceExists = await db
          .select()
          .from(tag_preferences)
          .where(
            and(
              eq(tag_preferences.user_uuid, user_uuid),
              eq(tag_preferences.tag_type, tag)
            )
          )
          .then((result) => result.length > 0);

        if (!preferenceExists) {
          await db.insert(tag_preferences).values({
            user_uuid,
            tag_type: tag,
            weight: "0",
          });
        } else {
          await db
            .update(tag_preferences)
            .set({
              weight: sql`${tag_preferences.weight} + ${multiplier}`,
            })
            .where(
              and(
                eq(tag_preferences.user_uuid, user_uuid),
                eq(tag_preferences.tag_type, tag)
              )
            );
        }
      })
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error updating preference.");
  }
}
