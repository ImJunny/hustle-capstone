import { ServiceFee } from "@/constants/Rates";
import { db } from "@/drizzle/db";
import { initiated_jobs, post_images, posts } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

// Get transaction estimate
export async function getTransactionEstimate(
  job_post_uuid: string,
  user_uuid?: string
) {
  try {
    // temporary take min_rate since there is no offer lookup
    const { rate } = await db
      .select({ rate: posts.min_rate })
      .from(posts)
      .where(eq(posts.uuid, job_post_uuid))
      .limit(1)
      .then(([post_rate]) => post_rate);

    // later add user_uuid for offer lookup
    const service_fee = Math.floor(rate * ServiceFee * 100) / 100;
    const total = rate - service_fee;

    return {
      rate,
      service_fee,
      total,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get transaction estimate.");
  }
}
export type TransactionEstimate = Awaited<
  ReturnType<typeof getTransactionEstimate>
>;

// Accept job
export async function acceptJob(
  user_uuid: string,
  job_post_uuid: string,
  linked_service_post_uuid: string | null
) {
  // temprorarily get min rate; use offer lookup later
  try {
    const is_already_accepted = await db
      .select()
      .from(initiated_jobs)
      .innerJoin(posts, eq(initiated_jobs.job_post_uuid, posts.uuid))
      .where(eq(initiated_jobs.worker_uuid, user_uuid))
      .limit(1)
      .then((posts) => posts.length > 0);
    if (is_already_accepted) throw new Error("already_accepted");

    await db.insert(initiated_jobs).values({
      rate: await db
        .select({ rate: posts.min_rate })
        .from(posts)
        .where(eq(posts.uuid, job_post_uuid))
        .limit(1)
        .then(([post_rate]) => post_rate.rate),
      job_post_uuid,
      linked_service_post_uuid,
      worker_uuid: user_uuid,
      progress_type: "accepted",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === "already_accepted")
      throw new Error("Already accepted this job");
    throw new Error("Failed to apply for job");
  }
}

// Get track job posts
export async function getTrackJobPosts(user_uuid: string) {
  // temprorarily get min rate; use offer lookup later
  try {
    const result = db
      .select({
        uuid: posts.uuid,
        title: posts.title,
        due_date: posts.due_date,
        progress: initiated_jobs.progress_type,
        image_url: post_images.image_url,
      })
      .from(initiated_jobs)
      .innerJoin(
        posts,
        and(
          eq(initiated_jobs.job_post_uuid, posts.uuid),
          eq(posts.type, "work")
        )
      )
      .innerJoin(post_images, eq(post_images.post_uuid, posts.uuid))
      .where(eq(initiated_jobs.worker_uuid, user_uuid));
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to apply for job.");
  }
}
export type TrackJobPost = Awaited<ReturnType<typeof getTrackJobPosts>>[number];
