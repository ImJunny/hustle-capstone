import { db } from "@/drizzle/db";
import { notifications, users } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { sendEmail } from "./email-actions";
import { notification_titles } from "@/constants/Data";

export async function sendNotification(
  user_uuid: string,
  type: keyof typeof notification_titles,
  extra_user_uuid: string
) {
  try {
    const username_type =
      type == "approved" || type == "paid" ? "worker" : "hirer";

    const username = await db
      .select({ username: users.username })
      .from(users)
      .where(
        eq(users.uuid, username_type == "worker" ? user_uuid : extra_user_uuid!)
      )
      .limit(1)
      .then((result) => result[0].username);

    const title = notification_titles[type](username!).title;
    const description = notification_titles[type](username!).description;
    await sendEmail(user_uuid, title, description);

    await db.insert(notifications).values({
      user_uuid,
      text: title,
    });

    // if (false) {
    //   await sendEmail(user_uuid, title, text);
    // }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send notification.");
  }
}

export async function getNotifications() {
  try {
    const result = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.created_at));
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get notifications.");
  }
}
