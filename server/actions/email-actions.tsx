import { EmailTemplate } from "@/email/notifications";
import { Resend } from "resend";

const resend = new Resend(process.env.EXPO_PUBLIC_RESEND_API_KEY);

export async function sendEmail() {
  try {
    const a = await resend.emails.send({
      from: "no-reply@hustleonline.info",
      to: "johnnguyen4501@gmail.com",
      subject: "@sukmoon approved your job!",
      react: <EmailTemplate />,
    });
    console.log("emailed");
    console.log(a);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email.");
  }
}
