import { ServiceFee } from "@/constants/Rates";
import { db } from "@/drizzle/db";
import { initiated_jobs, post_images, posts, users } from "@/drizzle/schema";
import { and, eq, ne, sql } from "drizzle-orm";

// Get job rate for unnaccepted OR accepted rate; unaccepted defaults to min, accepted defaults to initiated rate
export async function getTransactionEstimate(
  job_post_uuid: string,
  user_uuid?: string
) {
  function getEstimate(rate: number) {
    const service_fee = Math.floor(rate * ServiceFee * 100) / 100;
    const total = rate - service_fee;

    return {
      rate,
      service_fee,
      total,
    };
  }

  async function getGenericRate() {
    return await db
      .select({ min_rate: posts.min_rate })
      .from(posts)
      .where(eq(posts.uuid, job_post_uuid))
      .then(([result]) => getEstimate(result.min_rate));
  }

  try {
    if (!user_uuid) return await getGenericRate();

    const is_accepted = await db
      .select()
      .from(initiated_jobs)
      .where(
        and(
          eq(initiated_jobs.job_post_uuid, job_post_uuid),
          eq(initiated_jobs.worker_uuid, user_uuid)
        )
      )
      .then((result) => result.length > 0);

    if (is_accepted) {
      const rate = await db
        .select()
        .from(initiated_jobs)
        .where(
          and(
            eq(initiated_jobs.job_post_uuid, job_post_uuid),
            eq(initiated_jobs.worker_uuid, user_uuid)
          )
        )
        .then(([result]) => result.rate);
      return getEstimate(rate);
    } else return await getGenericRate();
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
  // temporarily get min rate; use offer lookup later
  try {
    const is_already_accepted = await db
      .select()
      .from(initiated_jobs)
      .where(
        and(
          eq(initiated_jobs.job_post_uuid, job_post_uuid),
          eq(initiated_jobs.worker_uuid, user_uuid)
        )
      )
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

// Get track working posts
export async function getTrackWorkingPosts(user_uuid: string) {
  try {
    const result = await db
      .select({
        uuid: posts.uuid,
        title: posts.title,
        due_date: posts.due_date,
        progress: initiated_jobs.progress_type,
        image_url: sql`(
                  SELECT ${post_images.image_url}
                  FROM ${post_images}
                  WHERE ${post_images.post_uuid} = ${posts.uuid}
                  ORDER BY ${post_images.image_url} ASC
                  LIMIT 1
                )`,
      })
      .from(initiated_jobs)
      .innerJoin(
        posts,
        and(
          eq(initiated_jobs.job_post_uuid, posts.uuid),
          eq(posts.type, "work")
        )
      )
      .where(eq(initiated_jobs.worker_uuid, user_uuid));
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get track working posts.");
  }
}
export type TrackPost = Awaited<
  ReturnType<typeof getTrackWorkingPosts>
>[number];

// Get track working details
export async function getTrackWorkingDetails(
  user_uuid: string,
  job_post_uuid: string
) {
  //use temporary min rate as accepted rate for now
  try {
    const result = await db
      .select({
        job_image_url: sql`(
          SELECT ${post_images.image_url}
          FROM ${post_images}
          WHERE ${post_images.post_uuid} = ${posts.uuid}
          ORDER BY ${post_images.image_url} ASC
          LIMIT 1
        )`,
        initiated_job_post_uuid: initiated_jobs.uuid,
        job_post_uuid: posts.uuid,
        title: posts.title,
        due_date: posts.due_date,
        progress: initiated_jobs.progress_type,
        employer_username: users.username,
        employer_avatar_url: users.avatar_url,
        accepted_rate: posts.min_rate,
        user_uuid: users.uuid,
        service_uuid: initiated_jobs.linked_service_post_uuid,
      })
      .from(initiated_jobs)
      .innerJoin(
        posts,
        and(
          eq(initiated_jobs.job_post_uuid, posts.uuid),
          eq(posts.uuid, job_post_uuid),
          eq(initiated_jobs.worker_uuid, user_uuid)
        )
      )
      .innerJoin(users, eq(posts.user_uuid, users.uuid))
      .limit(1);
    if (result.length > 0) return result[0];
    else return null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get job tracking details");
  }
}

// Get track working details; get initiated job if exists, otherwise list of accepted
export async function getTrackHiringDetails(
  user_uuid: string,
  job_post_uuid: string
) {
  try {
    const data_with_user = await db
      .select({
        accepted_count: sql`(
          SELECT COUNT(*)
          FROM ${initiated_jobs}
          WHERE ${initiated_jobs.job_post_uuid} = ${job_post_uuid}
        )`,
        job_image_url: sql`(
          SELECT ${post_images.image_url}
          FROM ${post_images}
          WHERE ${post_images.post_uuid} = ${posts.uuid}
          ORDER BY ${post_images.image_url} ASC
          LIMIT 1
        )`,
        initiated_job_post_uuid: initiated_jobs.uuid,
        job_post_uuid: posts.uuid,
        title: posts.title,
        due_date: posts.due_date,
        progress: initiated_jobs.progress_type,
        accepted_rate: posts.min_rate,
        user_username: users.username,
        user_avatar_url: users.avatar_url,
        user_uuid: users.uuid,
        service_uuid: initiated_jobs.linked_service_post_uuid,
      })
      .from(initiated_jobs)
      .innerJoin(
        posts,
        and(
          eq(initiated_jobs.job_post_uuid, posts.uuid),
          eq(posts.uuid, job_post_uuid),
          eq(posts.user_uuid, user_uuid),
          ne(initiated_jobs.progress_type, "accepted")
        )
      )
      .innerJoin(users, eq(initiated_jobs.worker_uuid, users.uuid))
      .limit(1)
      .then(([result]) => result);

    // If no approved worker, check for unapproved workers
    if (data_with_user) return { ...data_with_user, is_approved: true };
    const data_without_user = await db
      .select({
        accepted_count: sql`(
        SELECT COUNT(*)
        FROM ${initiated_jobs}
        WHERE ${initiated_jobs.job_post_uuid} = ${job_post_uuid}
      )`,
        job_image_url: post_images.image_url,
        job_post_uuid: posts.uuid,
        title: posts.title,
        due_date: posts.due_date,
        accepted_rate: posts.min_rate,
      })
      .from(posts)
      .leftJoin(
        post_images,
        and(
          eq(post_images.post_uuid, posts.uuid),
          eq(
            post_images.image_url,
            sql`(
            SELECT image_url
            FROM ${post_images}
            WHERE ${post_images.post_uuid} = ${posts.uuid}
            ORDER BY ${post_images.image_url} ASC
            LIMIT 1
          )`
          )
        )
      )
      .where(eq(posts.uuid, job_post_uuid))
      .limit(1)
      .then(([result]) => result);
    return { ...data_without_user, is_approved: false };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get job tracking details");
  }
}

// Unaccept job
export async function unacceptJob(initiated_job_post_uuid: string) {
  try {
    await db
      .delete(initiated_jobs)
      .where(eq(initiated_jobs.uuid, initiated_job_post_uuid));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to unaccept job");
  }
}

// Get track hiring posts
export async function getTrackHiringPosts(user_uuid: string) {
  try {
    const result = await db
      .selectDistinctOn([posts.uuid], {
        uuid: posts.uuid,
        title: posts.title,
        due_date: posts.due_date,
        image_url: post_images.image_url, // Get image_url from the JOIN
      })
      .from(posts)
      .leftJoin(post_images, eq(post_images.post_uuid, posts.uuid)) // LEFT JOIN for post images
      .where(
        and(
          eq(posts.user_uuid, user_uuid),
          eq(posts.type, "work"),
          ne(posts.status_type, "hidden")
        )
      )
      .orderBy(posts.uuid, post_images.image_url)
      .then(async (posts) =>
        Promise.all(
          posts.map(async (post) => {
            // Fetch job progress
            const approvedJob = await db
              .select({ progress: initiated_jobs.progress_type })
              .from(initiated_jobs)
              .where(
                and(
                  eq(initiated_jobs.job_post_uuid, post.uuid),
                  sql`${initiated_jobs.progress_type} != 'accepted'`
                )
              )
              .limit(1)
              .then((jobs) => jobs[0]);

            if (approvedJob) {
              return {
                ...post,
                progress: approvedJob.progress,
              };
            }

            // Count accepted jobs
            const acceptedJobCount = await db
              .select({ count: sql`COUNT(*)` })
              .from(initiated_jobs)
              .where(
                and(
                  eq(initiated_jobs.job_post_uuid, post.uuid),
                  eq(initiated_jobs.progress_type, "accepted")
                )
              )
              .then(([result]) => result.count);

            return {
              ...post,
              progress: `${acceptedJobCount} Accepted`,
            };
          })
        )
      );
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get track hiring posts.");
  }
}

// Get accepted users for track hiring post
export async function getAcceptedUsers(job_post_uuid: string) {
  try {
    const result = await db
      .select({
        user_uuid: users.uuid,
        user_username: users.username,
        user_display_name: users.display_name,
        user_avatar_url: users.avatar_url, // This correctly retrieves the avatar URL
        created_at: initiated_jobs.created_at,
        initiated_job_uuid: initiated_jobs.uuid,
        service: sql`(
        SELECT json_build_object(
          'uuid', ${posts.uuid},
          'title', ${posts.title},
          'image_url', (
            SELECT ${post_images.image_url}
            FROM ${post_images}
            WHERE ${post_images.post_uuid} = ${initiated_jobs.linked_service_post_uuid}
            ORDER BY ${post_images.image_url} ASC
            LIMIT 1
          )
        )
        FROM ${posts}
        WHERE ${posts.uuid} = ${initiated_jobs.linked_service_post_uuid}
      )`,
      })
      .from(initiated_jobs)
      .innerJoin(posts, eq(initiated_jobs.job_post_uuid, posts.uuid))
      .innerJoin(users, eq(initiated_jobs.worker_uuid, users.uuid)) // Joins users to get avatar_url
      .where(eq(initiated_jobs.job_post_uuid, job_post_uuid));
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get accepted users.");
  }
}
export type AcceptedUser = Awaited<ReturnType<typeof getAcceptedUsers>>[number];

// UPDATE JOB PROGRESS from CURRENT PROGRESS
export async function updateJobProgress(
  uuid: string,
  progress: "accepted" | "approved" | "in progress" | "complete" | "paid"
) {
  try {
    const progressOrder = [
      "accepted",
      "approved",
      "in progress",
      "complete",
      "paid",
    ];
    const currentIndex = progressOrder.indexOf(progress);
    if (currentIndex === -1 || currentIndex === progressOrder.length - 1) {
      throw new Error("Invalid or final progress type.");
    }

    const nextProgress = progressOrder[currentIndex + 1];

    await db
      .update(initiated_jobs)
      .set({
        progress_type: nextProgress,
      })
      .where(eq(initiated_jobs.uuid, uuid));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update progress.");
  }
}
