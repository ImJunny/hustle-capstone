import Text from "@/components/ui/Text";
import { db } from "@/drizzle/db";
import { notifications, users } from "@/drizzle/schema";
import { Html } from "@react-email/components";
import { desc, eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.EXPO_PUBLIC_RESEND_API_KEY);

export async function sendEmail(
  user_uuid: string,
  email_title: string,
  email_text: string
) {
  // get user email from user_uuid
  try {
    const email = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.uuid, user_uuid))
      .limit(1)
      .then((result) => result[0].email);
    await resend.emails.send({
      from: "no-reply@hustleonline.info",
      to: email,
      subject: email_title,
      react: (
        <Html lang="en">
          <Text>{email_text}</Text>
        </Html>
      ),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email.");
  }
}
