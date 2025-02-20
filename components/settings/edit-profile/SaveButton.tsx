import Button from "@/components/ui/Button";
import {
  updateUserImage,
  updateUserProfile,
  UserData,
} from "@/server/lib/user";
import { EditProfileSchema } from "@/zod/zod-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormGetValues, UseFormHandleSubmit } from "react-hook-form";
import Toast from "react-native-toast-message";
import { z } from "zod";

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
  const queryClient = useQueryClient();

  // Mutation to update user data when form submits
  const { mutate, isPending } = useMutation({
    mutationKey: ["userDataMutate"],
    mutationFn: async () => {
      const { username, firstname, lastname, bio } = getValues();
      // Update input values to database only if they are different
      if (
        ![data?.username, data?.first_name, data?.last_name, data?.bio].every(
          (value, i) => value == [username, firstname, lastname, bio][i]
        )
      ) {
        await updateUserProfile(
          data!.uuid,
          username,
          firstname,
          lastname,
          bio ?? ""
        );
      }
      if (isNewImage) await updateUserImage(data!.uuid, imageUri);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDataQuery"] });
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

  return (
    <Button
      style={{ alignSelf: "flex-end", minWidth: 120 }}
      disabled={isPending}
      onPress={handleSubmit(() => mutate())}
    >
      {isPending ? "Saving" : "Save"}
    </Button>
  );
}
