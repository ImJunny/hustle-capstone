import { ServiceFee } from "@/constants/Rates";
import { db } from "@/drizzle/db";
import {
  initiated_jobs,
  job_cancellations,
  payments,
  post_images,
  posts,
  reviews,
  users,
} from "@/drizzle/schema";
import { and, desc, eq, ne, or, sql } from "drizzle-orm";
import { update } from "lodash";
import { stripe } from "../lib/stripe-server";
import { sendNotification } from "./notification-actions";
import { sendPostMessage, sendTextMessage } from "./message-actions";

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

    //notify employer
    const employer_uuid = await db
      .select({ user_uuid: posts.user_uuid })
      .from(posts)
      .where(eq(posts.uuid, job_post_uuid))
      .then(([result]) => result.user_uuid);
    await sendNotification(employer_uuid, "job_accepted", user_uuid);
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === "already_accepted")
      throw new Error("Already accepted this job");
    throw new Error("Failed to apply for job");
  }
}

// Get track working posts; omit in progress jobs that aren't for them
export async function getTrackWorkingPosts(user_uuid: string) {
  try {
    const result = await db
      .select({
        uuid: posts.uuid,
        title: posts.title,
        due_date: posts.due_date,
        status_type: posts.status_type,
        progress: initiated_jobs.progress_type,
        image_url: sql`(
      SELECT ${post_images.image_url}
      FROM ${post_images}
      WHERE ${post_images.post_uuid} = ${posts.uuid}
      ORDER BY ${post_images.image_url} ASC
      LIMIT 1
      )`,
        else_approved: sql`(
      SELECT CASE
      WHEN EXISTS (
        SELECT 1
        FROM ${initiated_jobs}
        WHERE ${initiated_jobs.job_post_uuid} = ${posts.uuid}
        AND ${initiated_jobs.worker_uuid} != ${user_uuid}
        AND ${initiated_jobs.progress_type} != 'accepted'
        AND ${initiated_jobs.progress_type} != 'closed'
      )
      THEN true
      ELSE false
      END
      )`,
      })
      .from(initiated_jobs)
      .innerJoin(
        posts,
        and(
          eq(initiated_jobs.job_post_uuid, posts.uuid),
          eq(initiated_jobs.worker_uuid, user_uuid),
          or(
            eq(posts.status_type, "open"),
            eq(posts.status_type, "in progress"),
            eq(posts.status_type, "complete")
          ),
          ne(initiated_jobs.progress_type, "closed")
        )
      )
      .orderBy(desc(initiated_jobs.created_at));
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
        employer_avg_rating: sql`(
        SELECT AVG(${reviews.rating})
        FROM ${reviews}
        WHERE ${reviews.reviewee_uuid} = ${users.uuid}
      )`,
        employer_review_count: sql`(
        SELECT COUNT(*)
        FROM ${reviews}
        WHERE ${reviews.reviewee_uuid} = ${users.uuid}
      )`,
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
    const base_data = await db
      .select({
        job_image_url: sql`(
      SELECT ${post_images.image_url}
      FROM ${post_images}
      WHERE ${post_images.post_uuid} = ${posts.uuid}
      ORDER BY ${post_images.image_url} ASC
      LIMIT 1
      )`,
        job_post_uuid: posts.uuid,
        title: posts.title,
        due_date: posts.due_date,
        accepted_rate: sql`(
      SELECT ${initiated_jobs.rate}
      FROM ${initiated_jobs}
      WHERE ${initiated_jobs.job_post_uuid} = ${posts.uuid}
      AND ${initiated_jobs.progress_type} = 'accepted'
      LIMIT 1
      )`,
      })
      .from(posts)
      .leftJoin(post_images, eq(post_images.post_uuid, posts.uuid))
      .where(and(eq(posts.uuid, job_post_uuid), eq(posts.user_uuid, user_uuid)))
      .limit(1)
      .then(([result]) => result);

    const worker_data = await db
      .select({
        username: users.username,
        display_name: users.display_name,
        avg_rating: sql<number>`(
      SELECT AVG(${reviews.rating})
      FROM ${reviews}
      WHERE ${reviews.reviewee_uuid} = ${users.uuid}
      )`,
        review_count: sql<number>`(
      SELECT COUNT(*)
      FROM ${reviews}
      WHERE ${reviews.reviewee_uuid} = ${users.uuid}
      )`,
        progress: initiated_jobs.progress_type,
        service_uuid: initiated_jobs.linked_service_post_uuid,
        initiated_uuid: initiated_jobs.uuid,
        user_uuid: initiated_jobs.worker_uuid,
        avatar_url: users.avatar_url,
      })
      .from(users)
      .innerJoin(
        initiated_jobs,
        and(
          eq(initiated_jobs.worker_uuid, users.uuid),
          ne(initiated_jobs.progress_type, "accepted")
        )
      )
      .where(eq(initiated_jobs.job_post_uuid, job_post_uuid))
      .limit(1)
      .then((results) => (results.length > 0 ? results[0] : null));

    const accepted_count = (await db
      .select({ accepted_count: sql`COUNT(*)` })
      .from(initiated_jobs)
      .where(eq(initiated_jobs.job_post_uuid, job_post_uuid))
      .then(([result]) => result.accepted_count)) as number;

    return { ...base_data, accepted_count, worker_data };
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
        status_type: posts.status_type,
      })
      .from(posts)
      .leftJoin(post_images, eq(post_images.post_uuid, posts.uuid)) // LEFT JOIN for post images
      .where(
        and(
          eq(posts.user_uuid, user_uuid),
          eq(posts.type, "work"),
          ne(posts.status_type, "deleted")
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
                  ne(initiated_jobs.progress_type, "accepted"),
                  ne(initiated_jobs.progress_type, "closed")
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
        avg_rating: sql`(
        SELECT AVG(${reviews.rating})
        FROM ${reviews}
        WHERE ${reviews.reviewee_uuid} = ${users.uuid}
      )`,
        review_count: sql`(
        SELECT COUNT(*)
        FROM ${reviews}
        WHERE ${reviews.reviewee_uuid} = ${users.uuid}
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

// CANCEL JOB for APPROVED job; refund pending payments,
// make job available again, and make post status in progress->open
export async function cancelJob(
  initiated_uuid: string,
  user_uuid: string,
  cancellation_reason: string,
  details: string | undefined
) {
  try {
    const initiatedData = await db
      .update(initiated_jobs)
      .set({
        progress_type: "cancelled",
      })
      .where(eq(initiated_jobs.uuid, initiated_uuid))
      .returning({
        post_uuid: initiated_jobs.job_post_uuid,
        worker_uuid: initiated_jobs.worker_uuid,
      })
      .then(([result]) => result);

    await db.insert(job_cancellations).values({
      job_uuid: initiated_uuid,
      user_uuid: user_uuid,
      type: cancellation_reason,
      details,
    });

    // refund
    await db
      .update(payments)
      .set({
        title: "Refund",
        status: "refunded",
      })
      .where(eq(payments.job_uuid, initiated_uuid));

    // draft post
    await db
      .update(posts)
      .set({
        status_type: "open",
      })
      .where(eq(posts.uuid, initiatedData.post_uuid));

    const employer_uuid = await db
      .select({ user_uuid: posts.user_uuid })
      .from(posts)
      .where(eq(posts.uuid, initiatedData.post_uuid))
      .then(([result]) => result.user_uuid);

    const worker_uuid = initiatedData.worker_uuid;
    await sendNotification(
      employer_uuid,
      "job_cancelled",
      user_uuid,
      initiatedData.post_uuid
    );
    await sendNotification(
      worker_uuid,
      "job_cancelled",
      user_uuid,
      initiatedData.post_uuid
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to cancel job.");
  }
}

// APPROVE JOB should make payment entry and update job progress
export async function approveJob(
  initiated_uuid: string,
  user_uuid: string,
  payment_intent_id: string
) {
  try {
    // amount is in cents; convert to dollars
    const amount = await stripe.paymentIntents
      .retrieve(payment_intent_id)
      .then((intent) => intent.amount / 100);

    const worker_uuid = await db
      .select({ worker_uuid: initiated_jobs.worker_uuid })
      .from(initiated_jobs)
      .where(eq(initiated_jobs.uuid, initiated_uuid))
      .then(([result]) => result.worker_uuid);

    const job_title = await db
      .select({ title: posts.title })
      .from(posts)
      .innerJoin(initiated_jobs, eq(posts.uuid, initiated_jobs.job_post_uuid))
      .where(eq(initiated_jobs.uuid, initiated_uuid))
      .then(([result]) => result.title);

    // make pending payment to be updated later for BOTH parties
    // hirer payment entry
    await db.insert(payments).values({
      job_uuid: initiated_uuid,
      amount: String(amount),
      stripe_payment_intent_id: payment_intent_id,
      title: job_title,
      status: "pending",
      user_uuid,
      type: "expense",
    });
    const post_uuid = await db
      .select({ post_uuid: initiated_jobs.job_post_uuid })
      .from(initiated_jobs)
      .where(eq(initiated_jobs.uuid, initiated_uuid))
      .then(([result]) => result.post_uuid);

    const workerCompensation = await getTransactionEstimate(post_uuid);
    // worker payment entry
    await db.insert(payments).values({
      job_uuid: initiated_uuid,
      amount: String(workerCompensation.total),
      stripe_payment_intent_id: null,
      title: job_title,
      status: "pending",
      user_uuid: worker_uuid,
      type: "income",
    });

    // update rows after approval
    await db
      .update(initiated_jobs)
      .set({
        progress_type: "closed",
      })
      .where(
        and(
          eq(initiated_jobs.job_post_uuid, post_uuid),
          ne(initiated_jobs.uuid, initiated_uuid)
        )
      );

    await db
      .update(posts)
      .set({
        status_type: "in progress",
      })
      .where(eq(posts.uuid, post_uuid));

    await db
      .update(initiated_jobs)
      .set({
        progress_type: "approved",
      })
      .where(eq(initiated_jobs.uuid, initiated_uuid));

    // notify worker of approval
    await sendNotification(worker_uuid, "job_approved", user_uuid, post_uuid);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to approve job.");
  }
}

// worker approved->in progress
export async function startJob(initiated_uuid: string) {
  try {
    const initiatedData = await db
      .update(initiated_jobs)
      .set({
        progress_type: "in progress",
      })
      .where(and(eq(initiated_jobs.uuid, initiated_uuid)))
      .returning({
        worker_uuid: initiated_jobs.worker_uuid,
        post_uuid: initiated_jobs.job_post_uuid,
      })
      .then(([result]) => result);

    const employer_uuid = await db
      .select({ user_uuid: posts.user_uuid })
      .from(posts)
      .where(
        eq(
          posts.uuid,
          await db
            .select({ job_post_uuid: initiated_jobs.job_post_uuid })
            .from(initiated_jobs)
            .where(eq(initiated_jobs.uuid, initiated_uuid))
            .then(([result]) => result.job_post_uuid)
        )
      )
      .then(([result]) => result.user_uuid);

    await sendNotification(
      employer_uuid,
      "job_in_progress",
      initiatedData.worker_uuid,
      initiatedData.post_uuid
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to start job.");
  }
}

// worker in progress->complete
export async function completeJob(initiated_uuid: string) {
  try {
    const initiatedData = await db
      .update(initiated_jobs)
      .set({
        progress_type: "complete",
      })
      .where(and(eq(initiated_jobs.uuid, initiated_uuid)))
      .returning({
        worker_uuid: initiated_jobs.worker_uuid,
        post_uuid: initiated_jobs.job_post_uuid,
      })
      .then(([result]) => result);

    const employer_uuid = await db
      .select({ user_uuid: posts.user_uuid })
      .from(posts)
      .where(
        eq(
          posts.uuid,
          await db
            .select({ job_post_uuid: initiated_jobs.job_post_uuid })
            .from(initiated_jobs)
            .where(eq(initiated_jobs.uuid, initiated_uuid))
            .then(([result]) => result.job_post_uuid)
        )
      )
      .then(([result]) => result.user_uuid);

    await sendNotification(
      employer_uuid,
      "job_complete",
      initiatedData.worker_uuid,
      initiatedData.post_uuid
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to complete job.");
  }
}

// FINALIZE JOB should update payment to succeeded and update job progress to paid
export async function finalizeJob(initiated_uuid: string) {
  try {
    await db
      .update(payments)
      .set({
        status: "succeeded",
      })
      .where(
        and(
          eq(payments.job_uuid, initiated_uuid),
          eq(payments.status, "pending")
        )
      );

    const worker_uuid = await db
      .update(initiated_jobs)
      .set({
        progress_type: "paid",
      })
      .where(eq(initiated_jobs.uuid, initiated_uuid))
      .returning({ worker_uuid: initiated_jobs.worker_uuid })
      .then(([result]) => result.worker_uuid);

    const employer_uuid = await db
      .select({ user_uuid: posts.user_uuid })
      .from(posts)
      .where(
        eq(
          posts.uuid,
          await db
            .select({ job_post_uuid: initiated_jobs.job_post_uuid })
            .from(initiated_jobs)
            .where(eq(initiated_jobs.uuid, initiated_uuid))
            .then(([result]) => result.job_post_uuid)
        )
      )
      .then(([result]) => result.user_uuid);

    const post_uuid = await db
      .update(posts)
      .set({
        status_type: "complete",
      })
      .where(
        eq(
          posts.uuid,
          await db
            .select({ post_uuid: initiated_jobs.job_post_uuid })
            .from(initiated_jobs)
            .where(eq(initiated_jobs.uuid, initiated_uuid))
            .then(([result]) => result.post_uuid)
        )
      )
      .returning({ post_uuid: posts.uuid })
      .then(([result]) => result.post_uuid);

    await sendNotification(worker_uuid, "job_paid", employer_uuid, post_uuid);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to finalize job.");
  }
}

// sends message about hiring service
export async function hireService(
  user_uuid: string,
  job_uuid: string,
  service_uuid: string,
  message: string | undefined
) {
  try {
    const worker_uuid = await db
      .select({ worker_uuid: posts.user_uuid })
      .from(posts)
      .where(eq(posts.uuid, service_uuid))
      .limit(1)
      .then(([result]) => result.worker_uuid);

    await sendPostMessage(user_uuid, [worker_uuid], job_uuid);
    if (message) await sendTextMessage(user_uuid, worker_uuid, message);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send message.");
  }
}
