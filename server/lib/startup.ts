import { supabase } from "./supabase";

/*
  Supabase calls for startup data.
*/
/*
export const tagTypes = ["home", "tech", "art", "gaming", "other"];
export const locationTypes = ["remote", "local"];
export const statusTypes = ["open", "initiated", "complete"];
export const progressTypes = ["accepted", "in progress", "complete"];
*/

export async function insertTagTypes(tag_types: string[]) {
  const tagObjects = tag_types.map((tag) => ({ name: tag }));
  await supabase
    .from("tag_types")
    .upsert(tagObjects, { ignoreDuplicates: true });
}

export async function insertLocationTypes(location_types: string[]) {
  const locationObjects = location_types.map((location) => ({
    name: location,
  }));
  await supabase
    .from("tag_types")
    .upsert(locationObjects, { ignoreDuplicates: true });
}

export async function insertStatusTypes(status_types: string[]) {
  const statusObjects = status_types.map((status) => ({
    name: status,
  }));
  await supabase
    .from("tag_types")
    .upsert(statusObjects, { ignoreDuplicates: true });
}

export async function insertProgressTypes(progress_types: string[]) {
  const progressObjects = progress_types.map((progress) => ({
    name: progress,
  }));
  await supabase
    .from("tag_types")
    .upsert(progressObjects, { ignoreDuplicates: true });
}
