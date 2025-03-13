import { z } from "zod";
import Button from "../ui/Button";
import { Buffer } from "buffer";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useFormContext } from "react-hook-form";
import { CreatePostSchema } from "@/zod/zod-schemas";
import { useEffect, useState } from "react";
import { useCreatePostContext } from "@/contexts/CreatePostContext";

type PostSubmitButtonProps = {
  uuid?: string;
  isEditing?: boolean;
};

export default function PostSubmitButton({
  uuid,
  isEditing,
}: PostSubmitButtonProps) {
  const { user } = useAuthData();
  const utils = trpc.useUtils();
  const { handleSubmit, getValues, setValue } =
    useFormContext<z.infer<typeof CreatePostSchema>>();

  const [submitting, setSubmitting] = useState(false);

  const { mutate: createPost, isLoading: createLoading } =
    trpc.post.create_post.useMutation({
      onSuccess: async () => {
        await utils.post.invalidate();
        router.replace("/(main)/(tabs)/profile-main");
        Toast.show({
          text1: "Successfully created post",
          swipeable: false,
        });
      },
      onError: () => {
        Toast.show({
          text1: "Error creating post",
          type: "error",
          swipeable: false,
        });
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });

  const { mutate: updatePost, isLoading: updateLoading } =
    trpc.post.update_post.useMutation({
      onSuccess: async () => {
        await utils.post.invalidate();
        router.back();
        Toast.show({
          text1: "Successfully saved changes",
          swipeable: false,
        });
      },
      onError: () => {
        Toast.show({
          text1: "Error saving changes",
          type: "error",
          swipeable: false,
        });
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });

  async function createBuffer(imageUri: string) {
    const file = await fetch(imageUri);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  }

  useEffect(() => {
    const type = getValues("type");
    if (type === "hire") setValue("due_date", null);
  }, [getValues("type")]);

  const { isNewImages } = useCreatePostContext();

  async function submitForm(data: z.infer<typeof CreatePostSchema>) {
    if (!user) return;
    setSubmitting(true);
    const {
      type,
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

    if (isEditing) {
      updatePost({
        uuid: uuid!,
        title,
        description,
        min_rate,
        max_rate,
        location_type,
        location_address,
        due_date: due_date ?? null,
        image_buffers: isNewImages ? newImages : null,
      });
    } else {
      createPost({
        uuid: user.id,
        type,
        title,
        description,
        min_rate,
        max_rate,
        location_type,
        location_address,
        due_date: due_date ?? null,
        image_buffers: newImages,
      });
    }
  }

  return (
    <Button
      style={{ marginLeft: "auto", height: 40 }}
      onPress={() => {
        handleSubmit(submitForm)();
      }}
      disabled={createLoading || updateLoading || submitting}
    >
      {isEditing ? "Save changes" : "Create post"}
    </Button>
  );
}
