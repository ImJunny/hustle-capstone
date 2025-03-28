import { db } from "../../drizzle/db";
import {
  post_images,
  post_tags,
  users,
  posts,
  addresses,
  initiated_jobs,
} from "../../drizzle/schema";
import {
  eq,
  ilike,
  or,
  asc,
  desc,
  and,
  ne,
  gte,
  lte,
  sql,
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
  address_uuid: string | null,
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
      address_uuid,
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
  address_uuid: string | null,
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
        address_uuid,
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

// Get user job posts; can pass in optional type, otherwise all
export async function getUserPosts(uuid: string, type?: "work" | "hire") {
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
        image_url: sql`(
          SELECT ${post_images.image_url}
          FROM ${post_images}
          WHERE ${post_images.post_uuid} = ${posts.uuid}
          ORDER BY ${post_images.image_url} ASC
          LIMIT 1
        )`,
      })
      .from(posts)
      .where(
        and(
          eq(posts.user_uuid, uuid),
          ne(posts.status_type, "hidden"),
          type && eq(posts.type, type)
        )
      )
      .orderBy(desc(posts.created_at));

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
  distance: number;
};

export type Posts = Post[] | undefined;

// Get post details info; used in post details page
export async function getPostDetailsInfo(
  uuid: string,
  geocode: [number, number] | undefined
) {
  try {
    let location = null;
    if (geocode) {
      location = sql`ST_SetSRID(ST_MakePoint(${geocode[0]}, ${geocode[1]}), 4326)`;
    }

    const post = await db
      .select({
        uuid: posts.uuid,
        user_uuid: posts.user_uuid,
        description: posts.description,
        created_at: posts.created_at,
        type: posts.type,
        title: posts.title,
        due_date: posts.due_date,
        min_rate: posts.min_rate,
        max_rate: posts.max_rate,
        location_type: posts.location_type,
        address_uuid: posts.address_uuid,
        distance: geocode
          ? sql`ST_Distance(ST_SetSRID(addresses.location, 4326), ST_SetSRID(ST_MakePoint(${geocode[0]}, ${geocode[1]}), 4326)) * 0.000621371`
          : sql`NULL`,
      })
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
        avatar_url: users.avatar_url,
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
  min_distance: number | undefined,
  max_distance: number | undefined,
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
        address_uuid: posts.address_uuid,
        distance: geocode
          ? sql`ST_Distance(addresses.location::geometry::geography, ST_SetSRID(ST_MakePoint(${geocode[0]}, ${geocode[1]}), 4326)::geometry::geography) * 0.000621371`
          : sql`NULL`,
      })
      .from(posts)
      .leftJoin(addresses, eq(posts.address_uuid, addresses.uuid)) // Join address location
      .where(
        and(
          or(
            ilike(posts.title, `%${keyword}%`),
            ilike(posts.description, `%${keyword}%`)
          ),
          gte(posts.min_rate, min_rate ?? 10),
          or(
            max_rate === null
              ? sql`TRUE`
              : lte(posts.max_rate ?? posts.min_rate, max_rate ?? 10000),
            sql`TRUE`
          ),
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
      .select({
        uuid: posts.uuid,
        user_uuid: posts.user_uuid,
        title: posts.title,
        description: posts.description,
        min_rate: posts.min_rate,
        max_rate: posts.max_rate,
        type: posts.type,
        location_type: posts.location_type,
        due_date: posts.due_date,
        image_url: sql`(
          SELECT ${post_images.image_url}
          FROM ${post_images}
          WHERE ${post_images.post_uuid} = ${posts.uuid}
          ORDER BY ${post_images.image_url} ASC
          LIMIT 1
        )`,
        user_avatar_url: users.avatar_url,
        user_username: users.username,
      })
      .from(posts)
      .innerJoin(
        users,
        and(
          eq(users.uuid, posts.user_uuid),
          ne(posts.status_type, "hidden"),
          eq(posts.type, type)
        )
      );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get home posts.");
  }
}
export type HomePost = Awaited<ReturnType<typeof getHomePosts>>[number];

// Get active post counts
export async function getActivePostCounts(user_uuid: string) {
  try {
    const active_working_count = await db
      .select()
      .from(initiated_jobs)
      .innerJoin(
        posts,
        and(
          eq(initiated_jobs.job_post_uuid, posts.uuid),
          eq(posts.type, "work")
        )
      )
      .where(eq(initiated_jobs.worker_uuid, user_uuid))
      .then((posts) => posts.length);

    const active_hiring_count = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.type, "work"),
          eq(posts.user_uuid, user_uuid),
          ne(posts.status_type, "hidden")
        )
      )
      .then((posts) => posts.length);

    return {
      active_working_count,
      active_hiring_count,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get active post counts.");
  }
}

// Get post user progress
export async function isInitiated(user_uuid: string, job_post_uuid: string) {
  try {
    const result = await db
      .select({
        type: posts.type,
        uuid: posts.uuid,
        progress: initiated_jobs.progress_type,
      })
      .from(initiated_jobs)
      .innerJoin(
        posts,
        and(
          eq(initiated_jobs.job_post_uuid, posts.uuid),
          eq(posts.uuid, job_post_uuid),
          eq(initiated_jobs.worker_uuid, user_uuid)
        )
      );
    if (result.length > 0) return true;
    return false;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get post user progress");
  }
}
