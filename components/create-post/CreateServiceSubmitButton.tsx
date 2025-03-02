import { z } from "zod";
import Button from "../ui/Button";
import { CreateServiceSchema } from "@/zod/zod-schemas";
import { UseFormHandleSubmit } from "react-hook-form";
import { Buffer } from "buffer";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

type CreateServiceSubmitButtonProps = {
  handleSubmit: UseFormHandleSubmit<z.infer<typeof CreateServiceSchema>>;
};
export default function CreateServiceSubmitButton({
  handleSubmit,
}: CreateServiceSubmitButtonProps) {
  const { user } = useAuthData();
  const { mutate: createPost, isLoading } =
    trpc.post.create_service_post.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Successfully posted service",
          swipeable: false,
        });
        router.replace("/(main)/(tabs)");
      },
      onError: () => {
        Toast.show({
          text1: "Error posting service",
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

  async function submitForm(data: z.infer<typeof CreateServiceSchema>) {
    if (!user) return;
    const {
      title,
      description,
      min_rate,
      max_rate,
      location_type,
      location_address,
    } = data;
    let newImages = await Promise.all(
      data.images.map(async (imageUri) => await createBuffer(imageUri))
    );
    createPost({
      uuid: user.id,
      title,
      description,
      min_rate,
      max_rate,
      location_type,
      location_address,
      image_buffers: newImages,
    });
  }

  return (
    <Button
      style={{ marginLeft: "auto" }}
      onPress={handleSubmit(submitForm)}
      disabled={isLoading}
    >
      Post service
    </Button>
  );
}
