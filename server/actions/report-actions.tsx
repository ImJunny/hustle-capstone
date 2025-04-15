import { db } from "@/drizzle/db";
import {
  addresses,
  initiated_jobs,
  post_images,
  post_tags,
  posts,
  reported_posts,
  reviews,
} from "@/drizzle/schema";
import { and, desc, eq, ne, sql } from "drizzle-orm";

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

export async function getReportedPosts(
  user_uuid: string,
  geocode: [number, number] | undefined
) {
  try {
    let result = await db
      .select({
        uuid: posts.uuid,
        type: posts.type,
        title: posts.title,
        due_date: posts.due_date,
        min_rate: posts.min_rate,
        max_rate: posts.max_rate,
        location_type: posts.location_type,
        image_url: sql<string | null>`MIN(${post_images.image_url})`,
        tags: sql<string[]>`(
        SELECT ARRAY_AGG(${post_tags.tag_type})
        FROM ${post_tags}
        WHERE ${post_tags.post_uuid} = ${posts.uuid}
      )`,
        avg_rating: sql<number | null>`(
        SELECT AVG(${reviews}.rating)
        FROM ${reviews}
        INNER JOIN ${initiated_jobs}
        ON ${reviews.initiated_job_uuid} = ${initiated_jobs.uuid}
        WHERE ${initiated_jobs.linked_service_post_uuid} = ${posts.uuid}
      )`,
        review_count: sql<number>`(
        SELECT COUNT(*)
        FROM ${reviews}
        INNER JOIN ${initiated_jobs}
        ON ${reviews.initiated_job_uuid} = ${initiated_jobs.uuid}
        WHERE ${initiated_jobs.linked_service_post_uuid} = ${posts.uuid}
      )`,
        distance: geocode
          ? sql`ST_Distance(addresses.location::geometry::geography, ST_SetSRID(ST_MakePoint(${geocode[0]}, ${geocode[1]}), 4326)::geometry::geography) * 0.000621371`
          : sql`NULL`,
      })
      .from(posts)
      .innerJoin(reported_posts, eq(reported_posts.post_uuid, posts.uuid))
      .leftJoin(post_tags, eq(post_tags.post_uuid, posts.uuid))
      .leftJoin(post_images, eq(post_images.post_uuid, posts.uuid))
      .leftJoin(addresses, eq(posts.address_uuid, addresses.uuid))
      .where(
        and(
          eq(reported_posts.user_uuid, user_uuid),
          ne(posts.status_type, "deleted")
        )
      )
      .groupBy(posts.uuid, addresses.location)
      .orderBy(desc(posts.created_at));

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get reported posts.");
  }
}
