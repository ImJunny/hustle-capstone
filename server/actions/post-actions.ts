import { db } from "../../drizzle/db";
import {
  job_posts,
  post_images,
  post_tags,
  service_posts,
  users,
} from "../../drizzle/schema";
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
export async function getUserPostUUIDs(uuid: string, type: "work" | "hire") {
  try {
    let posts;
    if (type === "work") {
      const jobPosts = await db
        .select({
          uuid: job_posts.uuid,
        })
        .from(job_posts)
        .where(eq(job_posts.user_uuid, uuid));

      posts = jobPosts;
    } else {
      const servicePosts = await db
        .select({
          uuid: service_posts.uuid,
        })
        .from(service_posts)
        .where(eq(service_posts.user_uuid, uuid));
      posts = servicePosts;
    }
    const result = posts.map((post) => ({
      ...post,
      type,
    }));
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get user job posts uuids.");
  }
}
export type UserPostUUIDs = Awaited<
  ReturnType<typeof getUserPostUUIDs>
>[number];

// Get post by uuid; used in post card
export async function getPostInfo(uuid: string, type: "work" | "hire") {
  try {
    let post;
    if (type === "work") {
      let temp = await db
        .select({
          uuid: job_posts.uuid,
          title: job_posts.title,
          due_date: job_posts.due_date,
          min_rate: job_posts.min_rate,
          max_rate: job_posts.max_rate,
        })
        .from(job_posts)
        .where(eq(job_posts.uuid, uuid))
        .limit(1);
      post = temp[0];
    } else {
      const temp = await db
        .select({
          uuid: service_posts.uuid,
          title: service_posts.title,
          min_rate: service_posts.min_rate,
          max_rate: service_posts.max_rate,
        })
        .from(service_posts)
        .where(eq(service_posts.uuid, uuid))
        .limit(1);
      post = { ...temp[0], due_date: "" };
    }

    const postImage = await db
      .select({
        image_url: post_images.image_url,
      })
      .from(post_images)
      .where(
        eq(
          type === "work"
            ? post_images.job_post_uuid
            : post_images.service_post_uuid,
          uuid
        )
      )
      .limit(1);
    return {
      ...post,
      image_url: postImage[0].image_url,
      type,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get post info.");
  }
}
export type PostInfo = Awaited<ReturnType<typeof getPostInfo>>;

// Get job post info
export async function getJobPostInfo(uuid: string) {
  try {
    const result = await db
      .select({
        uuid: service_posts.uuid,
        title: service_posts.title,
        due_date: job_posts.due_date,
        min_rate: service_posts.min_rate,
        max_rate: service_posts.max_rate,
      })
      .from(service_posts)
      .where(eq(job_posts.user_uuid, uuid))
      .limit(1);
    return result[0];
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get post info.");
  }
}

// Get service post info
export async function getServicePostInfo(uuid: string) {
  try {
    const result = await db
      .select({
        uuid: service_posts.uuid,
        title: service_posts.title,
        min_rate: service_posts.min_rate,
        max_rate: service_posts.max_rate,
      })
      .from(service_posts)
      .where(eq(job_posts.user_uuid, uuid))
      .limit(1);
    return { ...result[0], due_date: "" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get post info.");
  }
}

// Get post details info; used in post details page
export async function getPostDetailsInfo(uuid: string, type: string) {
  try {
    const post = await db
      .select()
      .from(job_posts)
      .where(eq(type === "work" ? job_posts.uuid : service_posts.uuid, uuid));
    const poster_uuid = post[0].user_uuid;

    const postTags = await db
      .select({
        tag_name: post_tags.tag_type,
      })
      .from(post_tags)
      .where(
        eq(
          type === "work"
            ? post_tags.job_post_uuid
            : post_tags.service_post_uuid,
          uuid
        )
      );
    const postImages = await db
      .select({
        image_url: post_images.image_url,
      })
      .from(post_images)
      .where(
        eq(
          type === "work"
            ? post_images.job_post_uuid
            : post_images.service_post_uuid,
          uuid
        )
      );
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
export type PostDetailsInfo = Awaited<ReturnType<typeof getPostDetailsInfo>>;
