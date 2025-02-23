import { S3Client } from "@aws-sdk/client-s3";
export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.EXPO_PUBLIC_AWS_REGION as string,
});
