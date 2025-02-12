import { supabase } from "./supabase";

// Check if a user exists in the database
export async function doesUserExist(uuid: string) {
  const { error, data } = await supabase
    .from("users")
    .select()
    .or(`uuid.eq.${uuid},email.eq.${uuid}`)
    .single();
  if (error) return error;

  if (data?.uuid) return true;
  return false;
}

// Create user if they don't exist in the database
export async function createUser(
  uuid: string,
  email: string,
  username: string,
  firstName: string,
  lastName: string
) {
  const doesExist = await doesUserExist(uuid);
  if (doesExist) {
    return "User already exists.";
  }

  await supabase
    .from("users")
    .insert({
      uuid,
      email,
      created_at: new Date().toISOString(),
      username,
      first_name: firstName,
      last_name: lastName,
    });
  return "Success";
}
