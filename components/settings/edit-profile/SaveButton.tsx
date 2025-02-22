import Button from "@/components/ui/Button";
import { updateUserAvatar, UserData } from "@/server/actions/user-actions";
import { trpc } from "@/server/lib/trpc-client";
import { EditProfileSchema } from "@/zod/zod-schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseFormGetValues, UseFormHandleSubmit } from "react-hook-form";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { Buffer } from "buffer";

type SaveButtonProps = {
  data: UserData | undefined;
  getValues: UseFormGetValues<z.infer<typeof EditProfileSchema>>;
  handleSubmit: UseFormHandleSubmit<z.infer<typeof EditProfileSchema>>;
  imageUri: string | undefined;
  isNewImage: boolean;
};
export default function SaveButton({
  data,
  getValues,
  handleSubmit,
  imageUri,
  isNewImage,
}: SaveButtonProps) {
  const utils = trpc.useUtils();

  const { mutate: performUpdates, isLoading } = useMutation({
    mutationFn: async () => {
      const { username, firstname, lastname, bio } = getValues();
      await updateProfile({
        uuid: data!.uuid,
        username,
        first_name: firstname,
        last_name: lastname,
        bio: bio ?? "",
      });
      if (isNewImage && imageUri) {
        const file = await fetch(imageUri);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await updateAvatar({
          uuid: data!.uuid,
          image_buffer: buffer,
        });
      }
    },
    onSuccess: async () => {
      await utils.user.invalidate();
      Toast.show({
        text1: "Profile saved",
        swipeable: false,
      });
    },
    onError: () => {
      Toast.show({
        text1: "Error in saving profile",
        type: "error",
        swipeable: false,
      });
    },
  });

  const { mutate: updateProfile } = trpc.user.update_user_profile.useMutation();
  const { mutate: updateAvatar } = trpc.user.update_user_avatar.useMutation();

  async function submit() {
    const { username, firstname, lastname, bio } = getValues();
    if (
      ![data?.username, data?.first_name, data?.last_name, data?.bio].every(
        (value, i) => value == [username, firstname, lastname, bio][i]
      ) ||
      isNewImage
    )
      await performUpdates();
  }

  return (
    <Button
      style={{ alignSelf: "flex-end", minWidth: 120 }}
      disabled={isLoading}
      onPress={handleSubmit(submit)}
    >
      {isLoading ? "Saving" : "Save"}
    </Button>
  );
}
