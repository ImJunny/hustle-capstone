import { supabase } from "./supabase";

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
    if (exists) throw "User already exists...";
    const { error } = await supabase.from("users").insert({
      uuid,
      created_at: new Date().toISOString(),
      email,
      first_name,
      last_name,
      username,
    });
    if (error) throw error;
    console.log("Created user!");
  } catch (error) {
    return error;
  }
}
