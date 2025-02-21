import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/s3";

// Upload image to s3 with custom name
export async function uploadImage(image_uri: string, image_name: string) {
  const file = await fetch(image_uri);
  const fileBlob = await file.blob();
  const params = {
    Bucket: process.env.EXPO_PUBLIC_AWS_BUCKET_NAME,
    Key: image_name,
    Body: fileBlob,
    ContentType: "image/jpeg",
    CacheControl: "no-cache",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
  } catch (error) {
    throw error;
  }
}
