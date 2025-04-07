import { db } from "@/drizzle/db";
import { initiated_jobs, posts, reviews, users } from "@/drizzle/schema";
import { and, eq, or, sql } from "drizzle-orm";

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
