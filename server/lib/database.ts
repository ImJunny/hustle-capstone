import { users } from "@/drizzle/schema";
import { supabase } from "./supabase";
import { InferModel, InferSelectModel } from "drizzle-orm";

export const dbResponse = (
  isSuccess: boolean,
  data?: any,
  message?: string
) => ({
  isSuccess,
  data,
  message,
});

// Check if a user exists in the database
export async function doesUserExist(uuid: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .or(`uuid.eq.${uuid},email.eq.${uuid}`);

    if (error) throw error;
    if (data && data.length > 0) return true;
    return false;
  } catch (error) {
    return error;
  }
}

// Create user if they don't exist in the database
export async function createUser(
  uuid: string,
  email: string,
  username: string,
  first_name: string,
  last_name: string
) {
  try {
    const exists = await doesUserExist(uuid);
    if (exists) throw "User already exists!";

    const { error } = await supabase.from("users").insert({
      uuid,
      created_at: new Date().toISOString(),
      email,
      first_name,
      last_name,
      username,
    });
    if (error) throw error;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// Confirm user after verification from email
export async function verifyUser(uuid: string, confirmed_at: string) {
  try {
    const { error } = await supabase
      .from("users")
      .update({ confirmed_at })
      .or(`uuid.eq${uuid}`);
    if (error) throw error;
    return;
  } catch (error) {
    return error;
  }
}

// Get user info
export async function getUserInfo(uuid: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uuid", uuid)
      .single();
    if (error) throw error;
    return data || null;
  } catch (error) {
    return error;
  }
}

export type UserInfo = InferSelectModel<typeof users>;
