import { db } from "../../drizzle/db";
import {
  post_images,
  users,
  posts,
  messages,
  initiated_jobs,
  chats,
} from "../../drizzle/schema";
import { eq, or, and, ne, desc } from "drizzle-orm/sql";

export async function getChatInfo(sender_uuid: string, receiver_uuid: string) {
  try {
    const avatar_url = await db
      .select({
        avatar_url: users.avatar_url,
      })
      .from(users)
      .where(eq(users.uuid, receiver_uuid))
      .limit(1);

    const receiver_info = await db
      .select({
        receiver_uuid: users.uuid,
        receiver_username: users.username,
        receiver_avatar_url: users.avatar_url,
      })
      .from(users)
      .where(eq(users.uuid, receiver_uuid))
      .limit(1);

    const sender_chats = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.sender_uuid, sender_uuid),
          eq(messages.receiver_uuid, receiver_uuid)
        )
      );

    const receiver_chats = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.sender_uuid, receiver_uuid),
          eq(messages.receiver_uuid, sender_uuid)
        )
      );

    const all_chats = [...sender_chats, ...receiver_chats];

    all_chats.sort((a, b) => {
      return (
        Date.parse(a.created_at.toString()) -
        Date.parse(b.created_at.toString())
      );
    });

    const formattedChats = await Promise.all(
      all_chats.map(async (chat) => {
        // Initialize the object with basic fields
        const chatData: any = {
          sender_uuid: chat.sender_uuid,
          message: chat.message,
          timestamp: chat.created_at,
          chat_type: chat.type,
          message_uuid: chat.uuid,
        };

        // Fetch image URL if this message is related to a post (i.e., chat.post_uuid is not null)
        if (chat.type === "post" && chat.post_uuid) {
          const image = await db
            .select({
              image_url: post_images.image_url,
              title: posts.title,
              due_date: posts.due_date,
            })
            .from(post_images)
            .fullJoin(posts, eq(post_images.post_uuid, posts.uuid))
            .where(eq(post_images.post_uuid, chat.post_uuid))
            .limit(1);

          if (image.length > 0) {
            chatData.image_url = image[0].image_url;
          }
        }

        if (chat.type === "progress" && chat.post_uuid) {
          const job = await db
            .select({
              progress: initiated_jobs.progress_type,
              title: posts.title,
            })
            .from(initiated_jobs)
            .fullJoin(posts, eq(initiated_jobs.job_post_uuid, posts.uuid))
            .where(eq(initiated_jobs.job_post_uuid, chat.post_uuid))
            .limit(1);

          if (job.length > 0) {
            chatData.progress = job[0].progress; // Add progress to the chat
          }
        }

        return chatData;
      })
    );
    const result = {
      avatar_url: avatar_url[0].avatar_url,
      receiver_info: receiver_info[0],
      chats: formattedChats,
    };
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get chat info.");
  }
}
// export type ChatsInfo = Awaited<ReturnType<typeof getChatInfo>>;
export type ChatsInfo = {
  avatar_url: string | undefined;
  receiver_info: {
    receiver_uuid: string;
    receiver_username: string | null;
    receiver_avatar_url: string | null;
  };
  chats: {
    sender_uuid: string;
    message: string | null;
    timestamp: string | Date;
    chat_type: "text" | "post" | "progress";
  }[];
}[];

export async function getMessagePreviews(user_uuid: string) {
  try {
    const result = await db
      .select({
        receiver_uuid: users.uuid,
        receiver_display_name: users.display_name,
        receiver_avatar_url: users.avatar_url,
        last_message: messages.message,
        last_message_uuid: messages.uuid,
        last_message_timestamp: messages.created_at,
        last_message_receiver_uuid: messages.receiver_uuid,
        is_read: messages.is_read,
      })
      .from(chats)
      .innerJoin(messages, eq(chats.last_message_uuid, messages.uuid))
      .innerJoin(
        users,
        and(
          ne(users.uuid, user_uuid),
          or(
            eq(users.uuid, messages.sender_uuid),
            eq(users.uuid, messages.receiver_uuid)
          ),
          or(
            eq(messages.sender_uuid, user_uuid),
            eq(messages.receiver_uuid, user_uuid)
          )
        )
      )
      .orderBy(desc(messages.created_at));
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get message previews.");
  }
}
export type MessagePreview = Awaited<
  ReturnType<typeof getMessagePreviews>
>[number];

export async function sendTextMessage(
  sender_uuid: string,
  receiver_uuid: string,
  message: string
) {
  try {
    // Insert the message and retrieve the inserted message's UUID
    const [newMessage] = await db
      .insert(messages)
      .values({
        sender_uuid,
        receiver_uuid,
        message,
      })
      .returning({ uuid: messages.uuid });

    // Determine if a chat entry has already been made
    const [chat] = await db
      .select()
      .from(chats)
      .innerJoin(messages, eq(chats.last_message_uuid, messages.uuid))
      .where(
        and(
          or(
            eq(messages.sender_uuid, sender_uuid),
            eq(messages.receiver_uuid, sender_uuid)
          ),
          or(
            eq(messages.sender_uuid, receiver_uuid),
            eq(messages.receiver_uuid, receiver_uuid)
          )
        )
      )
      .limit(1);

    if (chat)
      await db
        .update(chats)
        .set({
          last_message_uuid: newMessage.uuid,
        })
        .where(eq(chats.uuid, chat.chats.uuid));
    else
      await db.insert(chats).values({
        last_message_uuid: newMessage.uuid,
      });
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message.");
  }
}

// MARK MESSAGE AS READ; marks the RECEIVER's messages as read
export async function markAsRead(sender_uuid: string, receiver_uuid: string) {
  try {
    await db
      .update(messages)
      .set({ is_read: true })
      .where(
        and(
          eq(messages.receiver_uuid, sender_uuid),
          eq(messages.sender_uuid, receiver_uuid)
        )
      );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to mark message as read.");
  }
}
