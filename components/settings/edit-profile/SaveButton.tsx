import Button from "@/components/ui/Button";
import { UserData } from "@/server/actions/user-actions";
import { trpc } from "@/server/lib/trpc-client";
import { EditProfileSchema } from "@/zod/zod-schemas";
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

  const { mutate: updateProfile, isLoading } =
    trpc.user.update_user_profile.useMutation({
      onSuccess: async () => {
        Toast.show({
          text1: "Profile saved",
          swipeable: false,
        });
        await utils.user.get_user_data.invalidate();
      },
      onError: () => {
        Toast.show({
          text1: "Error in saving profile",
          type: "error",
          swipeable: false,
        });
      },
    });

  async function submit() {
    const { username, firstname, lastname, bio } = getValues();
    // Prevent unnecessary database and s3 updates
    if (
      [data?.username, data?.first_name, data?.last_name, data?.bio].every(
        (value, i) => value == [username, firstname, lastname, bio][i]
      ) &&
      !isNewImage
    ) {
      Toast.show({
        text1: "No changes were made.",
        swipeable: false,
      });
      return;
    }

    let buffer = null;
    // Update profile
    if (isNewImage && imageUri) {
      const file = await fetch(imageUri);
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }
    updateProfile({
      uuid: data!.uuid,
      username,
      first_name: firstname,
      last_name: lastname,
      bio: bio ?? "",
      image_buffer: buffer ?? null,
    });
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
