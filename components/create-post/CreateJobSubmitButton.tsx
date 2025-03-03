import { z } from "zod";
import Button from "../ui/Button";
import { CreateJobSchema } from "@/zod/zod-schemas";
import { UseFormHandleSubmit } from "react-hook-form";
import { Buffer } from "buffer";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

type CreateJobSubmitButtonProps = {
  handleSubmit: UseFormHandleSubmit<z.infer<typeof CreateJobSchema>>;
};
export default function CreateJobSubmitButton({
  handleSubmit,
}: CreateJobSubmitButtonProps) {
  const { user } = useAuthData();
  const utils = trpc.useUtils();
  const { mutate: createPost, isLoading } = trpc.post.create_post.useMutation({
    onSuccess: async () => {
      Toast.show({
        text1: "Successfully posted job",
        swipeable: false,
      });
      await utils.post.invalidate();
      router.replace("/(main)/(tabs)");
    },
    onError: () => {
      Toast.show({
        text1: "Error posting job",
        type: "error",
        swipeable: false,
      });
    },
  });
  async function createBuffer(imageUri: string) {
    const file = await fetch(imageUri);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  }

  async function submitForm(data: z.infer<typeof CreateJobSchema>) {
    if (!user) return;
    const {
      title,
      description,
      min_rate,
      max_rate,
      location_type,
      location_address,
      due_date,
    } = data;
    let newImages = await Promise.all(
      data.images.map(async (imageUri) => await createBuffer(imageUri))
    );
    createPost({
      uuid: user.id,
      type: "work",
      title,
      description,
      min_rate,
      max_rate,
      location_type,
      location_address,
      due_date,
      image_buffers: newImages,
    });
  }

  return (
    <Button
      style={{ marginLeft: "auto" }}
      onPress={handleSubmit(submitForm)}
      disabled={isLoading}
    >
      Post job
    </Button>
  );
}
