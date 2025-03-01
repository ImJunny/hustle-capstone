import { db } from "../../drizzle/db";
import { job_posts, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm/sql";
import { uploadImage } from "./s3-actions";

// Check if user exists
export async function createJobPost(
  uuid: string,
  title: string,
  description: string,
  min_rate: number,
  max_rate: number | undefined,
  location_type: "local" | "remote",
  location_address: string | undefined,
  due_date: Date,
  image_buffers: any[]
) {
  try {
    await db.insert(job_posts).values({
      user_uuid: uuid,
      title,
      description,
      min_rate,
      max_rate,
      due_date: due_date.toDateString(),
      location_type,
      location_address,
      status_type: "open",
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create job post.");
  }
}
