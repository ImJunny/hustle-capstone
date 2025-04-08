import { db } from "@/drizzle/db";
import {
  initiated_jobs,
  post_images,
  posts,
  reviews,
  users,
} from "@/drizzle/schema";
import { and, desc, eq, or, sql } from "drizzle-orm";

// create review
export async function createReview(
  user_uuid: string,
  initiated_uuid: string,
  rating: number,
  review: string | undefined
) {
  try {
    const { worker_uuid, service_uuid, employer_uuid } = await db
      .select({
        worker_uuid: initiated_jobs.worker_uuid,
        service_uuid: initiated_jobs.linked_service_post_uuid,
        employer_uuid: posts.user_uuid,
      })
      .from(initiated_jobs)
      .innerJoin(
        posts,
        and(
          eq(initiated_jobs.job_post_uuid, posts.uuid),
          eq(initiated_jobs.uuid, initiated_uuid)
        )
      )
      .limit(1)
      .then(([result]) => result);

    if (worker_uuid === user_uuid) {
      await db.insert(reviews).values({
        reviewer_uuid: user_uuid,
        reviewee_uuid: employer_uuid,
        reviewer_type: "worker",
        rating,
        review,
        service_uuid,
        initiated_job_uuid: initiated_uuid,
      });
    } else if (employer_uuid === user_uuid) {
      await db.insert(reviews).values({
        reviewer_uuid: user_uuid,
        reviewee_uuid: worker_uuid,
        reviewer_type: "employer",
        rating,
        review,
        service_uuid,
        initiated_job_uuid: initiated_uuid,
      });
    } else {
      throw new Error("User is not part of the job.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error creating review.");
  }
}

export async function isAlreadyReviewed(
  user_uuid: string,
  initiated_uuid: string
) {
  try {
    return await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.initiated_job_uuid, initiated_uuid),
          eq(reviews.reviewer_uuid, user_uuid)
        )
      )
      .limit(1)
      .then(([result]) => !!result);
  } catch (error) {
    console.error(error);
    throw new Error("Error checking if they already reviewed.");
  }
}

export async function getReview(user_uuid: string, initiated_uuid: string) {
  try {
    const result = await db
      .select({
        rating: reviews.rating,
        review: reviews.review,
        created_at: reviews.created_at,
      })
      .from(reviews)
      .where(
        and(
          eq(reviews.initiated_job_uuid, initiated_uuid),
          eq(reviews.reviewer_uuid, user_uuid)
        )
      )
      .limit(1)
      .then(([result]) => result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error checking if they already reviewed.");
  }
}

export async function getReviews(
  user_uuid: string,
  reviewer_type: "worker" | "employer"
) {
  try {
    const result = await db
      .select({
        avatar_url: users.avatar_url,
        reviewer_username: users.username,
        reviewer_uuid: reviews.reviewer_uuid,
        reviewee_username:
          sql`(SELECT username FROM ${users} WHERE ${users}.uuid = ${reviews.reviewee_uuid})`.as(
            "reviewee_username"
          ),
        post_image_url:
          sql`(SELECT ${post_images.image_url} FROM ${post_images} WHERE ${post_images}.post_uuid = ${posts.uuid} ORDER BY ${post_images}.image_url ASC LIMIT 1)`.as(
            "post_image_url"
          ),
        post_uuid: posts.uuid,
        review: reviews.review,
        rating: reviews.rating,
        created_at: reviews.created_at,
      })
      .from(reviews)
      .where(
        and(
          eq(reviews.reviewee_uuid, user_uuid),
          eq(reviews.reviewer_type, reviewer_type)
        )
      )
      .innerJoin(
        initiated_jobs,
        eq(initiated_jobs.uuid, reviews.initiated_job_uuid)
      )
      .innerJoin(posts, eq(posts.uuid, initiated_jobs.job_post_uuid))
      .innerJoin(users, eq(users.uuid, reviews.reviewer_uuid))
      .orderBy(desc(reviews.created_at));

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error checking if they already reviewed.");
  }
}
export type ReviewData = Awaited<ReturnType<typeof getReviews>>[number];
