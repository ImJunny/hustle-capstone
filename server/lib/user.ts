import { supabase } from "./supabase";

/*
  Supabase calls for user-related data. Always throw the destructured
  error variable. We can handle errors with TanStack Query.
*/

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
    username,
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
