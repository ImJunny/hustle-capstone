import { db } from "@/drizzle/db";
import { accepted_jobs } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Apply for a job
export const applyForJob = async (
  user_uuid: string,
  job_uuid: string,
  p0: string
) => {
  try {
    const exists = await doesJobApplicationExist(user_uuid, job_uuid);

    if (exists) {
      throw new Error("You have already applied for this job.");
    }

    await db.insert(accepted_jobs).values({
      user_uuid,
      job_uuid,
    });

    return {
      success: true,
      message: "Job application submitted successfully.",
    };
  } catch (error) {
    console.error("Error applying for job:", error);
    throw new Error("Failed to apply for the job.");
  }
};

// Check if job application exists
export const doesJobApplicationExist = async (
  user_uuid: string,
  job_uuid: string
) => {
  try {
    const result = await db
      .select()
      .from(accepted_jobs)
      .where(
        and(
          eq(accepted_jobs.user_uuid, user_uuid),
          eq(accepted_jobs.job_uuid, job_uuid)
        )
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error(
      `Error checking job application for user: ${user_uuid}, job: ${job_uuid}`,
      error
    );
    throw new Error("Failed to verify job application status.");
  }
};

// Get all job applications for a user
export const getUserJobApplications = async (user_uuid: string) => {
  try {
    const result = await db
      .select()
      .from(accepted_jobs)
      .where(eq(accepted_jobs.user_uuid, user_uuid));

    return result;
  } catch (error) {
    console.error(
      `Error fetching job applications for user: ${user_uuid}`,
      error
    );
    throw new Error("Failed to fetch user job applications.");
  }
};
