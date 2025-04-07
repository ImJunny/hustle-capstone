import { db } from "../../drizzle/db";
import { reviews, users, initiated_jobs } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm/sql";
import { v4 as uuidv4 } from "uuid";

export async function createReview(
  reviewer_uuid: string,
  reviewee_uuid: string,
  job_uuid: string,
  review: string,
  rating: number,
  reviewer_type: "employer" | "employee"
) {
  try {
    await db.insert(reviews).values({
      uuid: uuidv4(),
      reviewer_uuid,
      reviewee_uuid,
      job_uuid,
      review,
      rating,
      reviewer_type,
      created_at: new Date(),
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create review.");
  }
}

export async function getUserReviews(
  reviewee_uuid: string,
  reviewer_type?: "employer" | "employee"
) {
  try {
    return await db
      .select({
        uuid: reviews.uuid,
        review: reviews.review,
        rating: reviews.rating,
        created_at: reviews.created_at,
        reviewer: {
          uuid: users.uuid,
          username: users.username,
          avatar_url: users.avatar_url,
        },
        job_uuid: reviews.job_uuid,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewer_uuid, users.uuid))
      .where(eq(reviews.reviewee_uuid, reviewee_uuid))
      .orderBy(desc(reviews.created_at));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user reviews.");
  }
}
export type UserReview = Awaited<ReturnType<typeof getUserReviews>>[number];

export async function getJobReviews(job_uuid: string) {
  try {
    return await db
      .select({
        uuid: reviews.uuid,
        review: reviews.review,
        rating: reviews.rating,
        created_at: reviews.created_at,
        reviewer: {
          uuid: users.uuid,
          username: users.username,
          avatar_url: users.avatar_url,
        },
        job_uuid: reviews.job_uuid,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewer_uuid, users.uuid))
      .where(eq(reviews.job_uuid, initiated_jobs.job_post_uuid))
      .orderBy(desc(reviews.created_at));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get job reviews.");
  }
}
export type JobReview = Awaited<ReturnType<typeof getJobReviews>>[number];

export async function getServiceReviews(service_post_uuid: string) {
  try {
    return await db
      .select({
        uuid: reviews.uuid,
        review: reviews.review,
        rating: reviews.rating,
        created_at: reviews.created_at,
        reviewer: {
          uuid: users.uuid,
          username: users.username,
          avatar_url: users.avatar_url,
        },
        job_uuid: reviews.job_uuid,
      })
      .from(reviews)
      .innerJoin(initiated_jobs, eq(reviews.job_uuid, initiated_jobs.uuid))
      .innerJoin(users, eq(reviews.reviewer_uuid, users.uuid))
      .where(eq(initiated_jobs.linked_service_post_uuid, service_post_uuid))
      .orderBy(desc(reviews.created_at));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get service reviews.");
  }
}
export type ServiceReview = Awaited<
  ReturnType<typeof getServiceReviews>
>[number];
