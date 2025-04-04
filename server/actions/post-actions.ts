import { db } from "../../drizzle/db";
import {
  post_images,
  post_tags,
  users,
  posts,
  addresses,
  initiated_jobs,
  saved_posts,
  comments,
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
  exists,
  inArray,
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
  image_buffers: any[],
  tags: string[]
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

    await Promise.all(
      tags.map((tag) =>
        db.insert(post_tags).values({
          tag_type: tag,
          post_uuid: post_uuid,
        })
      )
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
  image_buffers: any[] | null,
  tags: string[]
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
      for (let index = 0; index < image_buffers.length; index++) {
        const image = image_buffers[index];
        await uploadImage(`${uuid}-${index}`, image);
        await db.insert(post_images).values({
          image_url: `${
            process.env.EXPO_PUBLIC_AWS_IMAGE_BASE_URL
          }/${uuid}-${index}?=${new Date().getTime()}`,
          post_uuid: uuid,
        });
      }
    }

    await db.delete(post_tags).where(eq(post_tags.post_uuid, uuid));
    await Promise.all(
      tags.map((tag) =>
        db.insert(post_tags).values({
          tag_type: tag,
          post_uuid: uuid,
        })
      )
    );
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
        image_url: sql<string | null>`MIN(${post_images.image_url})`,
        tags: sql<string[]>`(
          SELECT ARRAY_AGG(${post_tags.tag_type})
          FROM ${post_tags}
          WHERE ${post_tags.post_uuid} = ${posts.uuid}
        )`,
      })
      .from(posts)
      .leftJoin(post_tags, eq(post_tags.post_uuid, posts.uuid))
      .leftJoin(post_images, eq(post_images.post_uuid, posts.uuid))
      .where(
        and(
          eq(posts.user_uuid, uuid),
          ne(posts.status_type, "hidden"),
          type ? eq(posts.type, type) : undefined
        )
      )
      .groupBy(posts.uuid) // Ensures we get one row per post
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
  distance: number | null;
  tags: string[] | undefined;
};

export type Posts = Post[] | undefined;

// Get post details info; used in post details page
export async function getPostDetailsInfo(
  uuid: string,
  user_uuid: string,
  geocode: [number, number] | undefined
) {
  try {
    const result = await db
      .select({
        uuid: posts.uuid,
        user_uuid: posts.user_uuid,
        description: posts.description,
        created_at: posts.created_at,
        type: posts.type,
        title: posts.title,
        due_date: posts.due_date,
        location_type: posts.location_type,
        min_rate: posts.min_rate,
        max_rate: posts.max_rate,
        address_uuid: posts.address_uuid,
        distance: geocode
          ? sql`ST_Distance(addresses.location::geometry::geography, ST_SetSRID(ST_MakePoint(${geocode[0]}, ${geocode[1]}), 4326)::geometry::geography) * 0.000621371`
          : sql`NULL`,
        tags: sql<string[]>`(
            SELECT ARRAY_AGG(${post_tags.tag_type})
            FROM ${post_tags}
            WHERE ${post_tags.post_uuid} = ${posts.uuid}
          )`,
        poster_info: {
          username: users.username,
          bio: users.bio,
          avatar_url: users.avatar_url,
        },
        is_liked: sql<boolean>`EXISTS(
          SELECT 1
          FROM ${saved_posts}
          WHERE ${saved_posts.post_uuid} = ${uuid}
          AND ${saved_posts.user_uuid} = ${user_uuid}
        )`,
        images: sql<string[]>`(
          SELECT ARRAY_AGG(${post_images.image_url} ORDER BY ${post_images.image_url} ASC)
          FROM ${post_images}
          WHERE ${post_images.post_uuid} = ${posts.uuid}
      )`,
        comment_count: sql<number>`(
        SELECT COUNT(*)
        FROM ${comments}
        WHERE ${comments.post_uuid} = ${posts.uuid}
        )`,
      })
      .from(posts)
      .leftJoin(post_tags, eq(post_tags.post_uuid, posts.uuid))
      .leftJoin(users, eq(users.uuid, posts.user_uuid))
      .leftJoin(addresses, eq(posts.address_uuid, addresses.uuid))
      .where(eq(posts.uuid, uuid))
      .groupBy(
        posts.uuid,
        users.username,
        users.bio,
        users.avatar_url,
        users.uuid,
        addresses.location
      )
      .limit(1)
      .then(([result]) => result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get post details info.");
  }
}
export type PostDetailsInfo = Awaited<ReturnType<typeof getPostDetailsInfo>>;

// Get a single post given a uuid; used to render Post component
export async function getPostInfo(uuid: string) {
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
        image_url: sql<string | null>`MIN(${post_images.image_url})`,
        tags: sql<string[]>`(
          SELECT ARRAY_AGG(${post_tags.tag_type})
          FROM ${post_tags}
          WHERE ${post_tags.post_uuid} = ${posts.uuid}
        )`,
      })
      .from(posts)
      .leftJoin(post_tags, eq(post_tags.post_uuid, posts.uuid)) // Keep left join
      .leftJoin(post_images, eq(post_images.post_uuid, posts.uuid)) // Change to left join
      .where(eq(posts.uuid, uuid))
      .groupBy(posts.uuid, post_tags.post_uuid) // Ensure correct grouping
      .then(([result]) => result);

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get post info.");
  }
}

// Get posts by filters
export async function getPostsByFilters(
  keyword: string,
  min_rate: number | undefined,
  max_rate: number | undefined,
  min_distance: number,
  max_distance: number,
  location_type: "remote" | "local" | "all",
  type: "work" | "hire" | "all",
  sort:
    | "asc-rate"
    | "desc-rate"
    | "asc-dist"
    | "desc-dist"
    | undefined = undefined,
  geocode: [number, number] | undefined,
  tags: string[]
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
        tags: sql<string[]>`(
          SELECT ARRAY_AGG(${post_tags.tag_type})
          FROM ${post_tags}
          WHERE ${post_tags.post_uuid} = ${posts.uuid}
        )`,
        image_url: sql`(
          SELECT ${post_images.image_url}
          FROM ${post_images}
          WHERE ${post_images.post_uuid} = ${posts.uuid}
          ORDER BY ${post_images.image_url} ASC
          LIMIT 1
        )`,
      })
      .from(posts)
      .leftJoin(post_tags, eq(post_tags.post_uuid, posts.uuid))
      .leftJoin(addresses, eq(posts.address_uuid, addresses.uuid)) // Join address location
      .where(
        and(
          or(
            ilike(posts.title, `%${keyword}%`),
            ilike(posts.description, `%${keyword}%`)
          ),
          gte(posts.min_rate, min_rate ?? 0),
          or(
            max_rate === null
              ? sql`TRUE`
              : lte(posts.max_rate ?? posts.min_rate, max_rate ?? 10000),
            sql`TRUE`
          ),
          // Post type filtering
          type === "all"
            ? or(eq(posts.type, "work"), eq(posts.type, "hire"))
            : eq(posts.type, type),
          ne(posts.status_type, "hidden"),
          location_type === "all"
            ? or(
                eq(posts.location_type, "remote"),
                eq(posts.location_type, "local")
              )
            : eq(posts.location_type, location_type),
          // Distance filtering - Only apply to local jobs
          or(
            eq(posts.location_type, "remote"), // Always include remote jobs
            and(
              location_type !== "remote" && geocode
                ? and(
                    gte(
                      sql`ST_Distance(addresses.location::geometry::geography, ST_SetSRID(ST_MakePoint(${geocode[0]}, ${geocode[1]}), 4326)::geometry::geography) * 0.000621371`,
                      min_distance
                    ),
                    lte(
                      sql`ST_Distance(addresses.location::geometry::geography, ST_SetSRID(ST_MakePoint(${geocode[0]}, ${geocode[1]}), 4326)::geometry::geography) * 0.000621371`,
                      max_distance
                    )
                  )
                : sql`TRUE`
            )
          ),
          // Tag filtering - Ensure post has at least one matching tag
          tags.length > 0
            ? exists(
                db
                  .select({ tag_type: post_tags.tag_type })
                  .from(post_tags)
                  .where(
                    and(
                      eq(post_tags.post_uuid, posts.uuid),
                      inArray(post_tags.tag_type, tags)
                    )
                  )
              )
            : sql`TRUE`
        )
      )
      .groupBy(posts.uuid, addresses.location);

    if (sort === "asc-rate") {
      result = result.sort((a, b) => {
        return a.min_rate - b.min_rate;
      });
    } else if (sort === "desc-rate") {
      result = result.sort((a, b) => {
        return b.min_rate - a.min_rate;
      });
    } else if (sort === "asc-dist") {
      result = result.sort((a, b) => {
        return ((a.distance as any) ?? 0) - ((b.distance as any) ?? 0);
      });
    } else if (sort === "desc-dist") {
      result = result.sort((a, b) => {
        return ((b.distance as any) ?? 0) - ((a.distance as any) ?? 0);
      });
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

export async function getHomePosts(
  type: "work" | "hire",
  user_uuid: string | undefined
) {
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
        tags: sql<string[]>`(
      SELECT ARRAY_AGG(${post_tags.tag_type})
      FROM ${post_tags}
      WHERE ${post_tags.post_uuid} = ${posts.uuid}
      )`,
        is_liked: sql<boolean>`EXISTS(
      SELECT 1
      FROM ${saved_posts}
      WHERE ${saved_posts.post_uuid} = ${posts.uuid}
      AND ${saved_posts.user_uuid} = ${user_uuid}
      )`,
        comment_count: sql<number>`(
      SELECT COUNT(*)
      FROM ${comments}
      WHERE ${comments.post_uuid} = ${posts.uuid}
      )`,
      })
      .from(posts)
      .innerJoin(
        users,
        and(
          eq(users.uuid, posts.user_uuid),
          ne(posts.status_type, "hidden"),
          eq(posts.type, type)
        )
      )
      .orderBy(desc(posts.created_at));
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
          eq(posts.type, "work"),
          or(
            eq(initiated_jobs.progress_type, "in progress"),
            eq(initiated_jobs.progress_type, "approved")
          )
        )
      )
      .where(eq(initiated_jobs.worker_uuid, user_uuid))
      .then((posts) => posts.length);

    const active_hiring_count = await db
      .select()
      .from(initiated_jobs)
      .innerJoin(
        posts,
        and(
          eq(initiated_jobs.job_post_uuid, posts.uuid),
          eq(posts.user_uuid, user_uuid),
          or(
            eq(initiated_jobs.progress_type, "in progress"),
            eq(initiated_jobs.progress_type, "approved")
          ),
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
export async function getPostDetailsFooterInfo(
  user_uuid: string,
  job_post_uuid: string
) {
  try {
    const result = await db
      .select({
        min_rate: posts.min_rate,
        max_rate: posts.max_rate,
        initiated: sql<boolean>`EXISTS(
        SELECT 1
        FROM ${initiated_jobs}
        WHERE ${initiated_jobs.job_post_uuid} = ${job_post_uuid}
        AND ${initiated_jobs.worker_uuid} = ${user_uuid}
      )`,
      })
      .from(posts)
      .where(eq(posts.uuid, job_post_uuid))
      .then(([result]) => result);

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get post user progress");
  }
}
export async function savePost(postUuid: string, userUuid: string) {
  try {
    // Check if post is already saved to prevent duplicates
    const existingSavedPost = await db
      .select()
      .from(saved_posts)
      .where(
        and(
          eq(saved_posts.post_uuid, postUuid),
          eq(saved_posts.user_uuid, userUuid)
        )
      )
      .limit(1);

    if (existingSavedPost.length > 0) return;

    // Insert saved post
    await db.insert(saved_posts).values({
      post_uuid: postUuid,
      user_uuid: userUuid,
    });
  } catch (error) {
    console.error("Failed to save post:", error);

    if (error instanceof Error && error.message === "Post already saved") {
      return {
        success: false,
        message: "This post is already saved",
      };
    }

    return {
      success: false,
      message: "Failed to save post",
    };
  }
}

// Unsave a post action
export async function unsavePost(postUuid: string, userUuid: string) {
  try {
    // Delete the saved post
    await db
      .delete(saved_posts)
      .where(
        and(
          eq(saved_posts.post_uuid, postUuid),
          eq(saved_posts.user_uuid, userUuid)
        )
      );
  } catch (error) {
    console.error("Failed to unsave post:", error);

    return {
      success: false,
      message: "Failed to unsave post",
    };
  }
}

// Get saved posts
export async function getSavedPosts(
  userUuid: string,
  type: "work" | "hire"
): Promise<Post[]> {
  try {
    const savedPosts = await db
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
        distance: sql`NULL`,
        tags: sql<string[]>`(
          SELECT ARRAY_AGG(${post_tags.tag_type})
          FROM ${post_tags}
          WHERE ${post_tags.post_uuid} = ${posts.uuid}
        )`,
      })
      .from(saved_posts)
      .innerJoin(posts, eq(saved_posts.post_uuid, posts.uuid))
      .where(
        and(
          eq(saved_posts.user_uuid, userUuid),
          eq(posts.type, type),
          ne(posts.status_type, "hidden")
        )
      )
      .orderBy(desc(posts.created_at));

    return savedPosts as Post[];
  } catch (error) {
    console.error("Failed to get saved posts:", error);
    throw new Error("Failed to retrieve saved posts");
  }
}
