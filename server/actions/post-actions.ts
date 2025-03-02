import { db } from "../../drizzle/db";
import { job_posts, post_images, post_tags, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm/sql";
import { uploadImage } from "./s3-actions";
import { v4 as uuidv4 } from "uuid";

// Create job post
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
    const post_uuid = uuidv4();

    await db.insert(job_posts).values({
      uuid: post_uuid,
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

    await Promise.all(
      image_buffers.map(async (image, index) => {
        await uploadImage(`${post_uuid}-${index}`, image);
        await db.insert(post_images).values({
          image_url: `${
            process.env.EXPO_PUBLIC_AWS_IMAGE_BASE_URL
          }/${post_uuid}-${index}?=${new Date().getTime()}`,
          job_post_uuid: post_uuid,
        });
      })
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create job post.");
  }
}

// Get user job posts
export async function getUserJobPosts(uuid: string) {
  try {
    const result = await db
      .select({
        uuid: job_posts.uuid,
        title: job_posts.title,
        due_date: job_posts.due_date,
        min_rate: job_posts.min_rate,
        max_rate: job_posts.max_rate,
      })
      .from(job_posts)
      .where(eq(job_posts.user_uuid, uuid));
    // Add type to post
    const modifiedResult = result.map((post) => ({
      ...post,
      type: "work",
    }));
    return modifiedResult;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get user job posts.");
  }
}
export type UserJobPost = Awaited<ReturnType<typeof getUserJobPosts>>[number];

// Get post info
// Get user job posts
export async function getPostInfo(uuid: string, type: string) {
  try {
    const post = await db
      .select()
      .from(job_posts)
      .where(eq(job_posts.uuid, uuid));
    const poster_uuid = post[0].user_uuid;

    const postTags = await db
      .select({
        tag_name: post_tags.tag_type,
      })
      .from(post_tags)
      .where(eq(post_tags.job_post_uuid, uuid));
    const postImages = await db
      .select({
        image_url: post_images.image_url,
      })
      .from(post_images)
      .where(eq(post_images.job_post_uuid, uuid));
    const posterInfo = await db
      .select({
        user_username: users.username,
        user_bio: users.bio,
      })
      .from(users)
      .where(eq(users.uuid, poster_uuid));

    const result = {
      ...post[0],
      post_tags: postTags,
      post_images: postImages,
      ...posterInfo[0],
      type,
    };
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get post info.");
  }
}
export type PostInfo = Awaited<ReturnType<typeof getPostInfo>>;
