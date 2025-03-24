import { db } from "../../drizzle/db";
import { post_images, post_tags, users, posts } from "../../drizzle/schema";
import {
  eq,
  ilike,
  or,
  asc,
  desc,
  not,
  and,
  ne,
  gt,
  gte,
  lte,
} from "drizzle-orm/sql";
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

// Update post
export async function updatePost(
  uuid: string,
  title: string,
  description: string,
  min_rate: number,
  max_rate: number | undefined,
  location_type: "local" | "remote",
  location_address: string | undefined,
  due_date: Date | null,
  image_buffers: any[] | null
) {
  try {
    await db
      .update(posts)
      .set({
        title,
        description,
        min_rate,
        max_rate,
        due_date: due_date?.toDateString(),
        location_type,
        location_address,
        created_at: new Date(),
      })
      .where(eq(posts.uuid, uuid));

    if (image_buffers) {
      await db.delete(post_images).where(eq(post_images.post_uuid, uuid));
      await Promise.all(
        image_buffers.map(async (image, index) => {
          await uploadImage(`${uuid}-${index}`, image);
          await db.insert(post_images).values({
            image_url: `${
              process.env.EXPO_PUBLIC_AWS_IMAGE_BASE_URL
            }/${uuid}-${index}?=${new Date().getTime()}`,
            post_uuid: uuid,
          });
        })
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to save post.");
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
      .where(and(eq(posts.user_uuid, uuid), ne(posts.status_type, "hidden")))
      .orderBy(desc(posts.created_at));

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
    throw new Error("Failed to get user job posts.");
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

// Get posts by filters
export async function getPostsByFilters(
  keyword: string,
  min_rate: number | undefined,
  max_rate: number | undefined,
  type: "work" | "hire" | "all",
  sort: "asc" | "desc" | undefined = undefined,
  geocode: [number, number] | undefined
) {
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
      .where(
        and(
          or(
            ilike(posts.title, `%${keyword}%`),
            ilike(posts.description, `%${keyword}%`)
          ),
          gte(posts.min_rate, min_rate ?? 0),
          lte(posts.max_rate, max_rate ?? 10000),
          type === "all"
            ? or(eq(posts.type, "work"), eq(posts.type, "hire"))
            : eq(posts.type, type),
          ne(posts.status_type, "hidden")
        )
      );
    if (sort === "asc") {
      result = result.sort((a, b) => a.min_rate - b.min_rate);
    } else if (sort === "desc") {
      result = result.sort((a, b) => b.min_rate - a.min_rate);
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get posts by keyword.");
  }
}

// Delete post by uuid; this is a soft delete
export async function deletePost(uuid: string) {
  try {
    await db
      .update(posts)
      .set({
        status_type: "hidden",
      })
      .where(eq(posts.uuid, uuid));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete post.");
  }
}

export async function getHomePosts(type: "work" | "hire") {
  try {
    let result = await db
      .select()
      .from(posts)
      .where(and(eq(posts.type, type), ne(posts.status_type, "hidden")));

    result = await Promise.all(
      result.map(async (post) => {
        const image = await db
          .select({ image_url: post_images.image_url })
          .from(post_images)
          .where(eq(post_images.post_uuid, post.uuid))
          .orderBy(asc(post_images.image_url))
          .limit(1);

        return { ...post, image_url: image[0].image_url ?? null };
      })
    );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get home posts.");
  }
}
export type HomePost = {
  uuid: string;
  user_uuid: string;
  title: string;
  description: string;
  min_rate: number;
  max_rate: number | null;
  type: "work" | "hire";
  location_type: string;
  location_address: string | null;
  created_at: Date;
  due_date: string | null;
  status_type: string | null;
  image_url: string | null;
};
