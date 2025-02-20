import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

/*
  Supabase calls for post-related data. Always throw the destructured
  error variable. We can handle errors with TanStack Query.
*/

// // Create user if they don't exist in the database
// export async function createUser(
//   uuid: string,
//   email: string,
//   username: string,
//   first_name: string,
//   last_name: string,
//   created_at: string
// ) {
//   const userExists = await doesUserExist(uuid);
//   if (userExists) throw "User already exists.";

//   const { error } = await supabase.from("users").insert({
//     uuid,
//     email,
//     first_name,
//     last_name,
//     username: username.toLowerCase(),
//     created_at,
//   });

//   if (error) throw error;
// }

export async function createPost(
  poster_uuid: string,
  post_type: "job" | "service"
) {
  const uuid = uuidv4();
  await supabase.from("posts").insert({
    uuid,
    poster_uuid,
    typeEnum: post_type,
  });
}

export async function createJob() {}
