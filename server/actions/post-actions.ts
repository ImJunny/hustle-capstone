import { db } from "../../drizzle/db";
import { post_images, post_tags, users, posts } from "../../drizzle/schema";
import { eq, ilike, or, asc } from "drizzle-orm/sql";
import { uploadImage } from "./s3-actions";
import { v4 as uuidv4 } from "uuid";

// Create post
export async function createPost(
  uuid: string,
  type: "work" | "hire",
  title: string,
  description: string,
  min_rate: number,
  max_rate: number | undefined,
  location_type: "local" | "remote",
  location_address: string | undefined,
  due_date: Date | null,
  image_buffers: any[]
) {
  try {
    const post_uuid = uuidv4();

    await db.insert(posts).values({
      uuid: post_uuid,
      user_uuid: uuid,
      title,
      description,
      min_rate,
      max_rate,
      due_date: due_date?.toDateString(),
      location_type,
      location_address,
      status_type: "open",
      type,
    });

    await Promise.all(
      image_buffers.map(async (image, index) => {
        await uploadImage(`${post_uuid}-${index}`, image);
        await db.insert(post_images).values({
          image_url: `${
            process.env.EXPO_PUBLIC_AWS_IMAGE_BASE_URL
          }/${post_uuid}-${index}?=${new Date().getTime()}`,
          post_uuid,
        });
      })
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create post.");
  }
}

// Get user job posts
export async function getUserPosts(uuid: string) {
  try {
    let result = await db
      .select({
        uuid: posts.uuid,
        type: posts.type,
        title: posts.title,
        due_date: posts.due_date,
        min_rate: posts.min_rate,
        max_rate: posts.max_rate,
        location_type: posts.location_type,
      })
      .from(posts)
      .where(eq(posts.user_uuid, uuid));

    result = await Promise.all(
      result.map(async (post) => {
        const image = await db
          .select({ image_url: post_images.image_url })
          .from(post_images)
          .where(eq(post_images.post_uuid, post.uuid))
          .limit(1);

        return { ...post, image_url: image[0].image_url ?? null };
      })
    );
    return result as Post[];
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get user job posts uuids.");
  }
}
export type Post = {
  uuid: string;
  type: "work" | "hire";
  title: string;
  due_date: string;
  min_rate: number;
  max_rate: number;
  location_type: "local" | "remote";
  image_url: string;
};
export type Posts = Post[] | undefined;

// Get post details info; used in post details page
export async function getPostDetailsInfo(uuid: string) {
  try {
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.uuid, uuid))
      .limit(1);
    const poster_uuid = post[0].user_uuid;

    const postTags = await db
      .select({
        tag_name: post_tags.tag_type,
      })
      .from(post_tags)
      .where(eq(post_tags.post_uuid, uuid));
    const postImages = await db
      .select({
        image_url: post_images.image_url,
      })
      .from(post_images)
      .where(eq(post_images.post_uuid, uuid))
      .orderBy(asc(post_images.image_url));
    const posterInfo = await db
      .select({
        user_username: users.username,
        user_bio: users.bio,
      })
      .from(users)
      .where(eq(users.uuid, poster_uuid))
      .limit(1);

    const result = {
      ...post[0],
      post_tags: postTags,
      post_images: postImages,
      ...posterInfo[0],
    };
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get post details info.");
  }
}
export type PostDetailsInfo = Awaited<ReturnType<typeof getPostDetailsInfo>>;

// Get posts by keyword and type
export async function getPostsByKeyword(keyword: string) {
  try {
    const result = await db
      .select({
        uuid: posts.uuid,
        type: posts.type,
        title: posts.title,
        due_date: posts.due_date,
        min_rate: posts.min_rate,
        max_rate: posts.max_rate,
        location_type: posts.location_type,
      })
      .from(posts)
      .where(
        or(
          ilike(posts.title, `%${keyword}%`),
          ilike(posts.description, `%${keyword}%`)
        )
      );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get posts by keyword.");
  }
}
