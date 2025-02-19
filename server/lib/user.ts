import { supabase } from "./supabase";
import { Database } from "./types";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as ImageManipulator from "expo-image-manipulator";

/*
  Supabase calls for user-related data. Always throw the destructured
  error variable. We can handle errors with TanStack Query.
  The s3 client is defined here for any image updates or queries.
*/
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.EXPO_PUBLIC_AWS_REGION as string,
});

// Check if a user exists in the database
export async function doesUserExist(uuid: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("uuid", uuid);

  if (error) throw error;

  if (data && data.length > 0) return true;
  return false;
}

// Create user if they don't exist in the database
export async function createUser(
  uuid: string,
  email: string,
  username: string,
  first_name: string,
  last_name: string,
  created_at: string
) {
  const userExists = await doesUserExist(uuid);
  if (userExists) throw "User already exists.";

  const { error } = await supabase.from("users").insert({
    uuid,
    email,
    first_name,
    last_name,
    username: username.toLowerCase(),
    created_at,
  });

  if (error) throw error;
}

// Get user info
export async function getUserData(uuid: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) throw error;
  return data;
}
export type UserData = Database["app"]["Tables"]["users"]["Row"];

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

// Update user image from edit-profile only if it is different
export async function updateUserImage(
  uuid: string,
  image_uri: string | undefined
) {
  if (image_uri) {
    uploadImage(image_uri, uuid);
    const { error } = await supabase
      .from("users")
      .upsert({
        uuid,
        avatar_url: image_uri,
      })
      .eq("uuid", uuid);
    if (error) throw error;
  }
}

// Update user profile from edit-profile
export async function updateUserProfile(
  uuid: string,
  username: string,
  first_name: string,
  last_name: string,
  bio: string,
  image_uri?: string | null
) {
  const { data, error } = await supabase
    .from("users")
    .upsert({
      uuid,
      username,
      first_name,
      last_name,
      bio,
      image_uri,
    })
    .eq("uuid", uuid);

  if (error) throw error;
  return data;
}
