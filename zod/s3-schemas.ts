import { z } from "zod";

export const UploadImageSchema = z.object({
  image_uri: z.string(),
  uuid: z.string(),
});
